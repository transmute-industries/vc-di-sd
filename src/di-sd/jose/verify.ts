import { DiSdJoseDisclosureProof, RequestVerification } from './types'

import * as jose from 'jose'
import digestProof from '../urdna-2015/digestProof'
import canonize from '../urdna-2015/canonize'
import hmac from './hmac'
import digestMandatory from '../digestMandatory'

import cryptosuite from './cryptosuite'
import controller from './controller'


const encoder = new TextEncoder()

const verify = async ({
  document,
  verifier,
  documentLoader,
}: RequestVerification) => {
  const { proof, ...clone }: {proof: DiSdJoseDisclosureProof} = structuredClone(document)

  if (!proof) {
    throw new Error('No Proof to verify')
  }
  
  if (!proof.keys) {
    throw new Error('Proof contains no keys')
  }
  if (!proof.signature) {
    throw new Error('Proof contains no signature')
  }
  if (!proof.signatures) {
    throw new Error('Proof contains no signatures')
  }
  if (!proof.labels) {
    throw new Error('Proof contains no labels')
  }
  if (!proof.mandatoryIndexes) {
    throw new Error('Proof contains no mandatoryIndexes')
  }
  // Verify derived proof needs:
  // * canonized with hmac'd labels + mandatory message indexes + message
  //   index map => mandatory quads + SD quads (drop any overlap from SD quads)
  // * hash mandatory quads in order => mandatory hash
  // * verify SD quads
  // * verify main signature (includes mandatory quads verification)

  // 1. Generate `proofHash` in parallel.
  const promisedProofDigest = digestProof({
    algorithm: cryptosuite.digest,
    document: clone,
    proof,
    documentLoader,
  }).catch((e) => e)

  // 2. Parse disclosure `proof` to get parameters to verify.

  const { keys } = proof

  const [header, signature] = proof.signature.split('..')
  const encodedPayload = encoder.encode(JSON.stringify({ keys }))
  await verifier.verify({
    protected: header,
    payload: encodedPayload,
    signature,
  })
  const [disclosureJwk, hmacJwk, mandatoryJwk, proofJwk] = keys

  const hmacKey = jose.base64url.decode(hmacJwk.k)
  const nodeSigner = await hmac.signer(hmacKey)
  const labels = new Map(Object.entries(proof.labels))

  // 3. HMAC IDs in canonized document using given label map.
  const nquads = await canonize({
    document: clone,
    labels,
    documentLoader,
    signer: nodeSigner,
  })

  // 4. Separate N-Quads into mandatory and non-mandatory.
  const mandatoryIndexes = proof.mandatoryIndexes
  const mandatory:string[] = []
  const nonMandatory: string[] = []
  for (const index in nquads) {
    const nq = nquads[index]
    if (mandatoryIndexes.includes(index)) {
      mandatory.push(nq)
    } else {
      nonMandatory.push(nq)
    }
  }
  // 5. Hash any mandatory N-Quads.
  const mandatoryDigest = await digestMandatory({
    algorithm: cryptosuite.digest,
    values: mandatory,
  })
  // 6. Return data used by cryptosuite to verify.
  const proofDigest = await promisedProofDigest
  if (proofDigest instanceof Error) {
    throw proofDigest
  }

  // 1. Import `publicKey`.
  const localVerifier = await controller.verifier(disclosureJwk)

  // 2. Verify all signatures.
  if (proof.signatures.length !== nonMandatory.length) {
    throw new Error(
      `Signature count (${proof.signatures.length}) does not match ` +
        `non-mandatory message count (${nonMandatory.length}).`,
    )
  }

  try {
    for (const [index, detachedSignature] of proof.signatures.entries()) {
      const [encodedHeader, encodedSignature] = detachedSignature.split('..')
      await localVerifier.verify({
        protected: encodedHeader,
        payload: encoder.encode(nonMandatory[index]),
        signature: encodedSignature,
      })
    }
  } catch (e) {
    return { verified: false, document: clone }
  }
  // 3. Verify digest keys
  const mandatoryDigestMatches =
    mandatoryJwk.k == jose.base64url.encode(mandatoryDigest)
  const proofDigestMatches = proofJwk.k == jose.base64url.encode(proofDigest)
  const verified = mandatoryDigestMatches && proofDigestMatches
  return { verified: verified, document: clone }
}

export default verify

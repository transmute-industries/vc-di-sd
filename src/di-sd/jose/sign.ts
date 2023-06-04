import { RequestAddProof } from '../../types'
import { DiSdJoseDisclosureProof } from './types'
import * as jose from 'jose'
import digestProof from '../urdna-2015/digestProof'
import hmac from './hmac'

import pointersToFrame from '../urdna-2015/pointersToFrame'
import moment from 'moment'
import api from '../urdna-2015/group'
import digestMandatory from '../digestMandatory'

import cryptosuite from './cryptosuite'

import controller from './controller'

// Todo: agility
import canonizeDocument from '../urdna-2015/canonizeDocument'

const encoder = new TextEncoder()

const sign = async ({
  created,
  document,
  mandatoryPointers,
  signer,
  documentLoader,
}: RequestAddProof) => {
  
  const clone = structuredClone(document)
  if (clone === null){
    throw new Error('document must not be null.')
  }
  const proof = clone.proof || {
    type: 'DataIntegrityProof',
    created: created || moment().toISOString(),
    cryptosuite: `${cryptosuite.name}`,
    proofPurpose: 'assertionMethod',
    verificationMethod: `${signer.iss}${signer.kid}`,
  }
  delete clone.proof

  // 1. Generate `proofHash` in parallel.
  const promisedProofDigest = await digestProof({
    algorithm: cryptosuite.digest,
    document: clone,
    proof,
    documentLoader,
  })

  // 2. Generate HMAC for randomizing blank node identifiers.
  // const key = await hmac.key()
  const key = await hmac.key()
  const nodeSigner = await hmac.signer(key)

  // 3. Transform document into array of canonized N-Quads w/randomized bnids.
  const nquads = await canonizeDocument({
    document: clone,
    documentLoader,
    signer: nodeSigner,
  })

  // 4. Match mandatory and non-mandatory N-Quads using mandatory frame.
  const mandatoryFrame = pointersToFrame({
    document: clone,
    pointers: mandatoryPointers,
  })

  if (mandatoryFrame === null){
    throw new Error('mandatoryFrame must not be null')
  }

  const { matching, nonMatching } = await api.group({
    nquads,
    frame: mandatoryFrame,
    documentLoader,
  })
  const mandatory = Array.from(matching.values())
  const nonMandatory = Array.from(nonMatching.values()) as string[]

  // 5. Hash any mandatory N-Quads.
  const mandatoryDigest = await digestMandatory({
    algorithm: cryptosuite.digest,
    values: mandatory,
  })

  // 6. Export HMAC key.
  const hmacJwk = await nodeSigner.export()

  // 7. Return data used by cryptosuite to sign.
  const proofDigest = await promisedProofDigest
  if (proofDigest instanceof Error) {
    throw proofDigest
  }

  // 1. Sign non-mandatory quads using a locally generated key.
  const { publicKeyJwk, privateKeyJwk } = await controller.key.generate(
    signer.alg,
  )
  publicKeyJwk.kid = '#disclosure'
  publicKeyJwk.alg = signer.alg
  privateKeyJwk.alg = signer.alg
  const localSigner = await controller.signer(privateKeyJwk)

  const signatures = []
  for (const nq of nonMandatory) {
    const detached = await localSigner.sign(encoder.encode(nq))
    signatures.push(detached)
  }
  // 2. Create data to be signed.
  const jwk = controller.key.format(publicKeyJwk)
  jwk['claimset_formats_supported'] = ['w3cvc-jsonld']
  jwk[`claimset_claims_supported`] = mandatoryPointers

  const mandatoryJwk = {
    kid: '#mandatory',
    kty: 'oct',
    k: jose.base64url.encode(mandatoryDigest),
  }
  const proofJwk = {
    kid: '#proof',
    kty: 'oct',
    k: jose.base64url.encode(proofDigest),
  }

  // 3. Sign the data
  proof.keys = [jwk, hmacJwk, mandatoryJwk, proofJwk]
  proof.signature = await signer.sign(
    encoder.encode(JSON.stringify({ keys: proof.keys })),
  )
  proof.signatures = signatures
  document.proof = proof as DiSdJoseDisclosureProof
  return document
}

export default sign

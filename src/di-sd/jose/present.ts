import * as jose from 'jose'
import jsonld from 'jsonld'
import {
  RequestPresentation,
  RestrictedPublicKeyJwk,
  RestrictedHmacJwk,
} from './types'
import hmac from './hmac'

import pointersToFrame from '../urdna-2015/pointersToFrame'

import { filterAndGroup } from '../urdna-2015/group'

import cryptosuite from './cryptosuite'

// TODO: agility
import canonizeDocument from '../urdna-2015/canonizeDocument'

const encoder = new TextEncoder()

const present = async ({
  document,
  verifier,
  selectivePointers,
  documentLoader,
}: RequestPresentation) => {
  const { proof, ...clone } = structuredClone(document)

  if (!proof) {
    throw new Error('Proof is required.')
  }

  delete clone.proof

  const baseProof = Array.isArray(proof)
    ? proof.find(
        (p) => p.cryptosuite && p.cryptosuite.startsWith(cryptosuite.prefix),
      )
    : proof

  // ensure `purpose` matches `baseProof`
  if (baseProof.proofPurpose !== 'assertionMethod') {
    throw new Error('Only assertions can be disclosed.')
  }

  // generate data for disclosure
  // const discloseData = await _createDisclosureData({
  //   document,
  //   proof: baseProof,
  //   selectivePointers,
  //   documentLoader,
  // })
  // Create derived proof needs:
  // * canonized with hmac'd labels + frame (reveal doc)
  // * canonized with hmac'd labels + skolemized + frame (mandatory fields)
  // * canonized with hmac'd labels + skolemized + frame (message index map)
  // * toRDF skolemized mandatory fields frame (mandatory message indexes)
  // * toRDF skolemized frame (message index map)

  // 0. Resolve JWS from id
  const { keys, signature, signatures } = proof

  if (signatures == undefined) {
    throw new Error('No signatures to disclose')
  }

  // 1. Parse base `proof` to get parameters for disclosure proof.

  const [encodedHeader, encodedSignature] = proof.signature.split('..')
  const encodedPayload = encoder.encode(JSON.stringify({ keys }))

  await verifier.verify({
    protected: encodedHeader,
    payload: encodedPayload,
    signature: encodedSignature,
  })

  const [disclosureJwk, hmacJwk] = keys as [
    RestrictedPublicKeyJwk,
    RestrictedHmacJwk,
  ]

  // 2. Create HMAC API from `hmacKey`.
  const hmacKey = jose.base64url.decode(hmacJwk.k)
  const nodeSigner = await hmac.signer(hmacKey)

  // 3. Transform document into array of canonized N-Quads w/randomized bnids.
  const nquads = await canonizeDocument({
    document: clone,
    documentLoader,
    signer: nodeSigner,
  })

  // 4. Produce mandatory frame and combined frame from pointers.
  const mandatoryPointers = disclosureJwk[
    'claimset_claims_supported'
  ] as string[]
  const mandatoryFrame = pointersToFrame({
    document: clone,
    pointers: mandatoryPointers,
  })
  const combinedFrame = pointersToFrame({
    document: clone,
    pointers: mandatoryPointers.concat(selectivePointers),
  })
  if (!mandatoryFrame && !combinedFrame) {
    throw new Error('Nothing selected for disclosure.')
  }

  // 5. In parallel, frame to produce reveal document, split N-Quads into
  // mandatory and non-mandatory groups, and get blank node label map.
  const revealDoc = await jsonld.frame(clone, combinedFrame, {
    requireAll: true,
    explicit: true,
    omitGraph: true,
    documentLoader,
  })

  const {
    labels,
    filtered: { matching: relativeMandatory },
    matching: absoluteMandatory,
    nonMatching: nonMandatory,
  } = await filterAndGroup({
    nquads: nquads,
    filterFrame: combinedFrame,
    groupFrame: mandatoryFrame,
    documentLoader,
  })

  // 6. Get list of relative mandatory indexes to include in the proof data
  const mandatoryIndexes = Array.from(relativeMandatory.keys())

  // 7. Filter signatures from `baseProof` using matching non-mandatory
  //   absolute indexes and shifting by any absolute mandatory indexes that
  //   occur before each entry.
  let index = 0

  const filteredSignatures = signatures.filter(() => {
    while (absoluteMandatory.has(index.toString())) {
      index++
    }
    return nonMandatory.has((index++).toString())
  })

  // create new disclosure proof
  const newProof = {
    ...structuredClone(baseProof),
    signature: signature,
    signatures: filteredSignatures,
    labels: Object.fromEntries(labels),
    mandatoryIndexes: mandatoryIndexes,
  }

  // attach proof to reveal doc w/o context
  delete newProof['@context']
  revealDoc.proof = newProof

  // special treatment of `credentialSubject` for VCs
  if (typeof revealDoc.credentialSubject === 'string') {
    revealDoc.credentialSubject = {
      id: revealDoc.credentialSubject,
    }
  }

  return revealDoc
}

export default present

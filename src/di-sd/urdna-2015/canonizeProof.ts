import canonize from './canonize'

import { RequestCanonizeProof } from '../../types'

async function canonizeProof({
  document,
  proof,
  signer,
  documentLoader,
}: RequestCanonizeProof) {
  const clone = structuredClone(proof)
  clone['@context'] = document['@context']
  delete clone.keys
  delete clone.signature
  delete clone.signatures
  delete clone.labels
  delete clone.mandatoryIndexes
  return canonize({ signer, document: clone, documentLoader })
}

export default canonizeProof

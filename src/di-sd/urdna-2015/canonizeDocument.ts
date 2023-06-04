import canonize from './canonize'

import { RequestCanonizeDocument } from '../../types'

async function canonizeDocument({
  document,
  signer,
  documentLoader,
}: RequestCanonizeDocument) {
  const clone = structuredClone(document)
  return canonize({ signer, document: clone, documentLoader })
}

export default canonizeDocument

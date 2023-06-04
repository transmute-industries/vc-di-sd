import crypto from 'crypto'
import { RequestProofDigest } from '../../types'
import jsonld from 'jsonld'

const encoder = new TextEncoder()

async function digestProof({
  algorithm,
  document,
  proof,
  documentLoader,
}: RequestProofDigest): Promise<Uint8Array> {
  const clone = structuredClone(proof)
  clone['@context'] = document['@context']
  delete clone.keys
  delete clone.signature
  delete clone.signatures
  delete clone.labels
  delete clone.mandatoryIndexes
  
  const canonized = await jsonld.canonize(clone, {
    algorithm: 'URDNA2015',
    format: 'application/n-quads',
    documentLoader,
  })
  return new Uint8Array(
    crypto.createHash(algorithm).update(encoder.encode(canonized)).digest(),
  )
}

export default digestProof

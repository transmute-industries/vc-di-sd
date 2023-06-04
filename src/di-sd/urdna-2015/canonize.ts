import jsonld from 'jsonld'
import { NQuads } from 'rdf-canonize'

import remoteBlankNodeSigner from './remoteBlankNodeSigner'

import {
  RequestSignedBlankNodeComponents,
  Quad,
  RequestHmacIdCanonize,
} from '../../types'

const COMPONENT_NAMES = ['subject', 'predicate', 'object', 'graph']

const signBlankNodeComponents = async ({
  quad,
  signer,
}: RequestSignedBlankNodeComponents) => {
  const clone = structuredClone(quad)
  for (const name of COMPONENT_NAMES) {
    if (quad[name].termType === 'BlankNode') {
      clone[name].value = await signer.sign(quad[name].value)
    }
  }
  return clone
}

const canonize = async ({
  signer,
  labels,
  document,
  documentLoader,
}: RequestHmacIdCanonize): Promise<string[]> => {

  if (!(document && typeof document === 'object')) {
    throw new TypeError('"document" must be an object.')
  }

  const original = await jsonld.canonize(document, {
    algorithm: 'URDNA2015',
    format: 'application/n-quads',
    documentLoader,
  })

  const sorted = original.split('\n').sort().join('\n')

  const remoteSigner = await remoteBlankNodeSigner({ labels, signer })

  const signedQuads = await Promise.all(
    NQuads.parse(sorted).map((quad: Quad) =>
      signBlankNodeComponents({ quad, signer: remoteSigner }),
    ),
  )
  
  const serializedQuads = signedQuads
    .map((q: Quad) => NQuads.serializeQuad(q))
    .sort()

  return serializedQuads
}

export default canonize

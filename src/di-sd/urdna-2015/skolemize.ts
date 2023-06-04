import jsonld from 'jsonld'
import { DataIntegrityDocument, DocumentLoader } from '../../types'

export function deskolemize({ nquads }: { nquads: string[] }): string[] {
  const prefix = `urn:bnid`
  const mutated = []
  for (const nq of nquads) {
    if (!nq.includes(`${prefix}:`)) {
      mutated.push(nq)
    } else {
      mutated.push(nq.replace(/(<urn:bnid:([^>]+)>)/g, '_:$2'))
    }
  }
  return mutated
}

// FIXME: consider accepting optional skolem `prefix` to use instead of
// `urn:bnid` to help avoid paranoid clashes
export function skolemize({ nquads }: { nquads: string[] }): string[] {
  const prefix = `urn:bnid`
  const mutated = []
  for (const nq of nquads) {
    if (!nq.includes('_:')) {
      mutated.push(nq)
    } else {
      mutated.push(nq.replace(/(_:([^\s]+))/g, `<${prefix}:$2>`))
    }
  }
  return mutated
}

export async function toDeskolemizedRDF({
  doc,
  documentLoader,
}: {
  doc: DataIntegrityDocument
  documentLoader: DocumentLoader
}) {
  await jsonld
  // 1. Convert skolemized doc to RDF to produce skolemized N-Quads.
  const rdf = await jsonld.toRDF(doc, {
    format: 'application/n-quads',
    documentLoader,
  })

  // 2. Split N-Quads into arrays for deskolemization.
  const skolemized = rdf
    .split('\n')
    .slice(0, -1)
    .map((nq: string) => nq + '\n')

  // 3. Return deskolemize N-Quads.
  return deskolemize({ nquads: skolemized })
}

export type RequestSkolemizedDocument = {
  skolemized: string[] // really nquad array
  documentLoader: DocumentLoader
}

export async function createSkolemizedDocument({
  skolemized,
  documentLoader,
}: RequestSkolemizedDocument): Promise<DataIntegrityDocument> {
  // produce skolemized dataset document for filtering purposes
  const dataset = skolemized.join('')
  return jsonld.fromRDF(dataset, {
    format: 'application/n-quads',
    documentLoader,
  })
}

const api = {
  skolemize,
  deskolemize,
  toDeskolemizedRDF,
  createSkolemizedDocument,
}

export default api

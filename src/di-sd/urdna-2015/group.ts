import jsonld from 'jsonld'

import {
  skolemize,
  createSkolemizedDocument,
  toDeskolemizedRDF,
} from './skolemize'
import { VerifiableCredentialTypeFrame } from './pointersToFrame'
import { DataIntegrityDocument, DocumentLoader } from '../../types'

function _createLabelMap(map: Map<string, string>): Map<string, string> {
  // reverse map
  const reversed = new Map()
  for (const [k, v] of map.entries()) {
    // also handle removing `_:` prefix
    reversed.set(v.slice(2), k.slice(2))
  }
  return reversed
}

export type RequestGroup = {
  nquads: string[];
  skolemizedDoc?: DataIntegrityDocument
  frame: DataIntegrityDocument
  documentLoader: DocumentLoader
}

export type ResponseGroup = {
  nquads: string[]
  matching : Map<string, string> //really integer to nquad
  nonMatching: Map<number, string> //really integer to nquad
}

async function group({
  nquads,
  skolemizedDoc,
  frame,
  documentLoader,
}: RequestGroup): Promise<ResponseGroup> {
  // if no frame is given, all N-Quads fall into the non-matching group
  if (!frame) {
    return {
      nquads,
      matching: new Map(),
      nonMatching: new Map(nquads.entries()), // new Map(nquads.entries()), to switch back to int
    }
  }

  // 1. Generate `skolemizedDoc` if not given.
  if (!skolemizedDoc) {
    const skolemized = skolemize({ nquads })
    skolemizedDoc = await createSkolemizedDocument({
      skolemized,
      documentLoader,
    })
  }

  // 2. Frame skolemized document to get data that matches frame.
  // const framed = await _frame(skolemizedDoc, frame, options);
  const framed = await jsonld.frame(skolemizedDoc, frame, {
    documentLoader,
    requireAll: true,
    explicit: true,
    omitGraph: true,
  })

  // 3. Convert matching data back to deskolemized N-Quads.
  const matchingDeskolemized = await toDeskolemizedRDF({
    doc: framed,
    documentLoader,
  })

  // 4. Split N-Quads into matching / non-matching groups.
  const matching = new Map()
  const nonMatching = new Map()
  for (const index in nquads) {
    const nq = nquads[index]
    // if all matching quads not yet found and nquad matches
    if (
      matching.size < matchingDeskolemized.length &&
      matchingDeskolemized.includes(nq)
    ) {
      matching.set(index, nq)
    } else {
      nonMatching.set(index, nq)
    }
  }

  return { nquads, matching, nonMatching }
}

export type RequestFilterAndGroup = {
  nquads: string[]
  filterFrame: VerifiableCredentialTypeFrame
  groupFrame: VerifiableCredentialTypeFrame
  documentLoader: DocumentLoader
}

export type ResponseFilterAndGroup = {
  filtered: ResponseGroup
  labels: Map<string, string>
  matching: Map<string, string>
  nonMatching: Map<string, string>
}


export async function filterAndGroup({
  nquads,
  filterFrame,
  groupFrame,
  documentLoader,
}: RequestFilterAndGroup): Promise<ResponseFilterAndGroup> {

  // 1. Produce skolemized nquads and JSON-LD document for filtering purposes.
  const skolemized = skolemize({ nquads })
  const skolemizedDoc = await createSkolemizedDocument({
    skolemized,
    documentLoader
  })

  // 2. Frame to produce filtered document.
  const filteredDoc = await jsonld.frame(skolemizedDoc, filterFrame, {
    requireAll: true,
    explicit: true,
    omitGraph: true,
    documentLoader,
  })

  // 3. Get deskolemized N-Quads from the filtered document.
  const filteredNQuads = await toDeskolemizedRDF({
    doc: filteredDoc,
    documentLoader
  })

  // 4. In parallel, canonize `filteredNQuads` to get bnode identifier map and
  //   group `filteredDoc` N-Quads into those that match/do not match
  //   `groupFrame`.
  const canonicalIdMap = new Map()

  await jsonld.canonize(filteredNQuads.join(''), {
    documentLoader,
    inputFormat: 'application/n-quads',
    canonicalIdMap,
  })

  const groupResult = await group({
    nquads: filteredNQuads,
    skolemizedDoc: filteredDoc,
    frame: groupFrame,
    documentLoader,
  })

  // 5. Generate matching and non-matching maps based on original `nquads`.
  const matching = new Map()
  const nonMatching = new Map()
  const filteredMatches = Array.from(groupResult.matching.values())
  const filteredNonMatches = Array.from(groupResult.nonMatching.values())

  for (const index in nquads) {
    const nq = nquads[index]
    if (
      matching.size < filteredMatches.length &&
      filteredMatches.includes(nq)
    ) {
      matching.set(index, nq)
    } else if (
      nonMatching.size < filteredNonMatches.length &&
      filteredNonMatches.includes(nq)
    ) {
      nonMatching.set(index, nq)
    }
  }

  // 6. Return filtered and grouping results and bnode ID labelMap.
  return {
    filtered: groupResult,
    labels: _createLabelMap(canonicalIdMap),
    matching,
    nonMatching,
  }
}


const api = { group, filterAndGroup }

export default api

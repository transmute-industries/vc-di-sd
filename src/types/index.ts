
import { DiSdJoseDisclosureProof } from '../di-sd/jose/types'

export type QuadValue = {
  termType: 'NamedNode' | 'BlankNode' | string
  value: string
}

export type Quad = {
  subject: QuadValue
  predicate: QuadValue
  object: QuadValue
  graph: QuadValue
} & Record<string, QuadValue>

export type DocumentLoader = (id: string) => Promise<object>

export type RequestHmacIdCanonize = {
  signer: { sign: (bytes: Uint8Array) => Promise<Uint8Array> }
  labels?: Map<string, string>
  document: object
  documentLoader: DocumentLoader
}

export type RequestSignedBlankNodeComponents = {
  quad: Quad
  signer: { sign: (value: string) => Promise<string> }
}

export type JsonLdGraphNode = {
  id?: string
  type?: string | string[]
}

export type DataIntegrityDocument = {
  '@context': string | object
  proof?: DiSdJoseDisclosureProof
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} & any

export type RequestCanonizeDocument = {
  signer: { sign: (bytes: Uint8Array) => Promise<Uint8Array> }
  document: DataIntegrityDocument
  documentLoader: DocumentLoader
}

export type RequestCanonizeProof = {
  signer: { sign: (bytes: Uint8Array) => Promise<Uint8Array> }
  document: DataIntegrityDocument
  proof: DiSdJoseDisclosureProof
  documentLoader: DocumentLoader
}

export type JwsSigner = {
  alg: string
  iss: string,
  kid: string,
  sign: (bytes: Uint8Array) => Promise<string>
}

export type RequestAddProof = {
  created?: string
  signer: JwsSigner
  document: DataIntegrityDocument
  mandatoryPointers: string[]
  canonicalization: string,
  documentLoader: DocumentLoader
}

export type RequestProofDigest = {
  algorithm: 'sha256' | string
  proof: DiSdJoseDisclosureProof
  document: DataIntegrityDocument
  documentLoader: DocumentLoader
}

export type RequestMandatoryDigest = {
  algorithm: 'sha256' | string
  values: string[]
}



// {
//   kty: 'EC',
//   x: 'gHJ9FWD_G3lJaMb_qE9_zLFKj7q6Q7NdesOBksHuM6KL-kGy_YJj0fPJM5bcSV2d',
//   y: 'fmSQI1Loxh2337wfdAXu6zc3-_-87KJKOXI_K0nGX91mKFUop-gYCGPx-rhxICtk',
//   crv: 'P-384',
//   'urn:digest:sha256:mandatory': 'rQY5So7cWIonjcR_EFoLbMtipkJuqqHi1tlHHzymsak',
//   'urn:digest:sha256:proof': '5ZJsg25joripN0Nv33pmiyaTaMMBmXQlfy4uRcek_uE',
//   'urn:hmac:sha256:key': 'KrCxlM7p3_Nw5mJW-icOMW_qt_dztYTPbV6R7dBrOl4',
//   'urn:disclosure:mandatory': [ '/credentialSubject/driverLicense/issuingAuthority' ]
// }
export type DiSdJwk = {
  kty: 'EC'
  crv: 'P-384'
  x: string
  y: string
  'urn:digest:sha256:mandatory': string
  'urn:digest:sha256:proof': string
  'urn:hmac:sha256:key': string
  'urn:disclosure:mandatory': string[]
}




import { sd } from '../src'
import { documentLoader } from './documentLoader'
import { exampleVerifiableCredential, exampleControllerKeyPair } from './mock'

it('urdna2015', async () => {
  const canonicalization = 'urdna2015'
  const signer = await sd.jose.controller.signer(exampleControllerKeyPair.privateKeyJwk)
  const verifier = await sd.jose.controller.verifier(
    exampleControllerKeyPair.publicKeyJwk,
  )
  const protectedDocument = await sd.jose.sign({
    created: '2010-01-01T19:23:24Z',
    signer,
    document: exampleVerifiableCredential,
    mandatoryPointers: ['/credentialSubject/driverLicense/issuingAuthority'],
    canonicalization,
    documentLoader,
  })
  // console.log(JSON.stringify(protectedDocument.proof, null, 2))
  const presentedDocument = await sd.jose.present({
    verifier,
    document: protectedDocument,
    selectivePointers: ['/credentialSubject/driverLicense/dateOfBirth'],
    canonicalization,
    documentLoader,
  })
  // console.log(JSON.stringify(presentedDocument.proof, null, 2))
  const presentation = await sd.jose.verify({
    verifier,
    document: presentedDocument,
    canonicalization,
    documentLoader,
  })
  expect(presentation.verified).toBe(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {proof, ...verifiedDocument} = presentedDocument
  expect(presentation.document).toEqual(verifiedDocument)
})

/* eslint-disable @typescript-eslint/no-explicit-any */
import { sd } from '../src'
import fs from 'fs'
import { exampleVerifiableCredential } from './mock'
import { documentLoader } from './documentLoader'

const allowedAlg = ['ES256', 'ES384', 'RS256', 'ES256K', 'EdDSA']
const canonicalization = 'urdna2015'

let examples = ''
const fixtures: any = {}

describe.skip('update examples', () => {
  allowedAlg.forEach((alg) => {
    describe(alg, () => {
      let k: any
      let signer: any
      let verifier: any
      let credential: any
      let presentation: any
      let verification: any

      beforeAll(async () => {
        k = await sd.jose.controller.key.generate(alg)
        signer = await sd.jose.controller.signer(k.privateKeyJwk)
        signer.iss = 'did:web:txdmv.gov'
        signer.kid = await sd.jose.controller.key.kid(k.publicKeyJwk)
        verifier = await sd.jose.controller.verifier(k.publicKeyJwk)
      })

      it('Issue', async () => {
        credential = await sd.jose.sign({
          signer,
          document: exampleVerifiableCredential,
          mandatoryPointers: [
            '/credentialSubject/driverLicense/issuingAuthority',
          ],
          canonicalization,
          documentLoader,
        })
      })
      it('Present', async () => {
        presentation = await sd.jose.present({
          verifier,
          document: credential,
          selectivePointers: ['/credentialSubject/driverLicense/dateOfBirth'],
          canonicalization,
          documentLoader,
        })
      })
      it('Verify', async () => {
        verification = await sd.jose.verify({
          verifier,
          document: presentation,
          canonicalization,
          documentLoader,
        })
      })

      afterAll(() => {
        fixtures[alg] = {
          controller: k,
          credential,
          presentation,
          verification,
        }
        examples += `

<details>
<summary>${alg}</summary>

##### Controller
\`\`\`json
${JSON.stringify(k, null, 2)}
\`\`\`

##### Credential
\`\`\`json
${JSON.stringify(credential, null, 2)}
\`\`\`

##### Presentation
\`\`\`json
${JSON.stringify(presentation, null, 2)}
\`\`\`

##### Verification
\`\`\`json
${JSON.stringify(verification, null, 2)}
\`\`\`

</details>

`
      })
    })
  })

  afterAll(() => {
    const readme = fs.readFileSync('./README.md').toString()
    const [header] = readme.split('### Examples ')

    const flow = `

\`\`\`ts
const k = await sd.jose.controller.key.generate(alg)
const signer = await sd.jose.controller.signer(k.privateKeyJwk)
const verifier = await sd.jose.controller.verifier(k.publicKeyJwk)
const protectedDocument = await sd.jose.sign({
signer,
document: exampleVerifiableCredential,
mandatoryPointers: ['/credentialSubject/driverLicense/issuingAuthority'],
canonicalization,
documentLoader,
})
const presentedDocument = await sd.jose.present({
verifier,
document: protectedDocument,
selectivePointers: ['/credentialSubject/driverLicense/dateOfBirth'],
canonicalization,
documentLoader,
})
const presentation = await sd.jose.verify({
verifier,
document: presentedDocument,
canonicalization,
documentLoader,
})
\`\`\`

`
    const readMeWithExamples = [header, `### Examples \n`, flow, examples].join(
      '',
    )
    fs.writeFileSync('./README.md', readMeWithExamples)
    fs.writeFileSync('./examples.json', JSON.stringify(fixtures, null, 2))
  })
})

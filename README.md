# @transmute/vc-di-sd

<img src="./transmute-banner.png" />

#### [Questions? Contact Transmute](https://transmute.typeform.com/to/RshfIw?typeform-source=vc-di-sd)

#### 🚧 Warning Experimental 🔥

[![CI](https://github.com/transmute-industries/vc-di-sd/actions/workflows/ci.yml/badge.svg)](https://github.com/transmute-industries/vc-di-sd/actions/workflows/ci.yml)
![Branches](./badges/coverage-branches.svg)
![Functions](./badges/coverage-functions.svg)
![Lines](./badges/coverage-lines.svg)
![Statements](./badges/coverage-statements.svg)
![Jest coverage](./badges/coverage-jest%20coverage.svg)

<!-- [![NPM](https://nodei.co/npm/@transmute/vc-di-sd.png?mini=true)](https://npmjs.org/package/@transmute/vc-di-sd) -->

Experimental implementation inspired by but not compatible with:

- https://github.com/digitalbazaar/di-sd-primitives
- https://github.com/digitalbazaar/ecdsa-sd-2023-cryptosuite

Currently all the canonicalization stuff is the same.

... but there are plans to investigate replacing `urdna2015` with JSON Pointer.
... since JSON Pointer is already a dependency.

- JWK and JWS are used instead of multiformats & multicodec & custom cbor packing...
- `did:jwk` is used instead of`did:key`

## Usage

```sh
npm i @transmute/vc-di-sd --save
```

## Develop

```bash
npm i
npm t
npm run lint
npm run build
```

```ts
import sd from '@transmute/vc-di-sd'
const canonicalization = 'urdna2015'
```

### Examples 


```ts
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
```



<details>
<summary>ES256</summary>

##### Controller
```json
{
  "id": "did:jwk:eyJrdHkiOiJFQyIsImNydiI6IlAtMjU2IiwiYWxnIjoiRVMyNTYiLCJ4IjoidzFwTnZTSnlaZjlFXzRpS29vT1VaeGFKUXd2QUhiX1Y5c2ZsSG5mU2s2ZyIsInkiOiJsYXg4ZWc3NEZKVlVZaG5BdmFKa2xkT1RwZVFMUmJTYjl3WVNqUU1iNWhRIn0#0",
  "type": "JsonWebKey",
  "controller": "did:jwk:eyJrdHkiOiJFQyIsImNydiI6IlAtMjU2IiwiYWxnIjoiRVMyNTYiLCJ4IjoidzFwTnZTSnlaZjlFXzRpS29vT1VaeGFKUXd2QUhiX1Y5c2ZsSG5mU2s2ZyIsInkiOiJsYXg4ZWc3NEZKVlVZaG5BdmFKa2xkT1RwZVFMUmJTYjl3WVNqUU1iNWhRIn0",
  "publicKeyJwk": {
    "kty": "EC",
    "crv": "P-256",
    "alg": "ES256",
    "x": "w1pNvSJyZf9E_4iKooOUZxaJQwvAHb_V9sflHnfSk6g",
    "y": "lax8eg74FJVUYhnAvaJkldOTpeQLRbSb9wYSjQMb5hQ"
  },
  "privateKeyJwk": {
    "kty": "EC",
    "crv": "P-256",
    "alg": "ES256",
    "x": "w1pNvSJyZf9E_4iKooOUZxaJQwvAHb_V9sflHnfSk6g",
    "y": "lax8eg74FJVUYhnAvaJkldOTpeQLRbSb9wYSjQMb5hQ",
    "d": "scMGSKpUnBfAmEcNvECrpneNlVOqrZGUUcK60_T6IIw"
  }
}
```

##### Credential
```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.txdmv.gov/credentials/v1",
    "https://w3id.org/security/data-integrity/v1"
  ],
  "type": [
    "VerifiableCredential",
    "DriverLicenseCredential"
  ],
  "issuer": "did:web:txdmv.gov",
  "issuanceDate": "2010-01-01T19:23:24Z",
  "credentialSubject": {
    "driverLicense": {
      "type": "DriverLicense",
      "documentIdentifier": "T21387yc328c7y32h23f23",
      "dateOfBirth": "01-01-1990",
      "expirationDate": "01-01-2030",
      "issuingAuthority": "TX"
    }
  },
  "proof": {
    "type": "DataIntegrityProof",
    "created": "2023-06-04T22:35:08.444Z",
    "cryptosuite": "di-sd-urdna2015-jose-2042",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:web:txdmv.gov#urn:ietf:params:oauth:jwk-thumbprint:sha-256:MggqrOi2MEJR1qOeF8Q9gKRxUNB9vrjbwqogJ1Er8k8",
    "keys": [
      {
        "kid": "#disclosure",
        "kty": "EC",
        "crv": "P-256",
        "alg": "ES256",
        "x": "jYId68wSRiE4juVnaWW0V6BcJ_ZDItX12XUMc70lkmU",
        "y": "Mmnw8koRUqgIx4IAt5xpEgewa0LZ6qnM0k10gya9opE",
        "claimset_formats_supported": [
          "w3cvc-jsonld"
        ],
        "claimset_claims_supported": [
          "/credentialSubject/driverLicense/issuingAuthority"
        ]
      },
      {
        "kid": "#hmac",
        "kty": "oct",
        "alg": "HS256",
        "use": "sig",
        "key_ops": [
          "sign"
        ],
        "k": "hel_3wNuO5XYf-qs9-WiwWvC3vF8Ex0DisC_Lf924zI"
      },
      {
        "kid": "#mandatory",
        "kty": "oct",
        "k": "Kkchlbnz5M0gUEmsvqHWY1d0gYR3Gjzh5DTivzD7UVk"
      },
      {
        "kid": "#proof",
        "kty": "oct",
        "k": "N3ZIo4DTV7KVVThNNMceBE9eQKWpoKkCBXdyseM2_ok"
      }
    ],
    "signature": "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..AmwQsW61wdJDUvJjtuZ5sEFfnJWXvfjF3vGWE6FEWf-WbuvRZvYIZpee-c6h_7HP2MSnXw9nTPLxn5ucwokbsQ",
    "signatures": [
      "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..P99od2sunRa0LhuTBsDexzBduPk-YowUFfLyQ5UMqspEjx-5ejXApFWthndCSqyjxHbv0B3VvF7wxghW7lDdhA",
      "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..8v4rcYfMuKRkAtLZucMpPegDw70TklsRUCHjvXF7Q998hqVZqBXnczwaYxcxvpFd2e_GAhNkNMzwQHw3lN_Wcw",
      "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..b3nmlkqKvnD39gqid49_HQ5tDyayr8l_AdfEGEixwM9u196Plf67axDNnoMC5ClL9exxqC21EbQgGYPYEp_EhA",
      "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..IMJcjf0s9YteSsy090M9BPzyYAc43Kkek8Rj0XnvVdIMDgzpHaAceizJymcWV7z9Ev2IBgJF2Ug56Shp2nxBWg",
      "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..73PiUdCyaYh6B1WJw3wI3Hx6YynElpmFt4YCgOiGejjiyJyXBoDWzaxzteyTuPMpxT4pDxuPAFkgLnJUbv-RXw"
    ]
  }
}
```

##### Presentation
```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.txdmv.gov/credentials/v1",
    "https://w3id.org/security/data-integrity/v1"
  ],
  "type": [
    "VerifiableCredential",
    "DriverLicenseCredential"
  ],
  "credentialSubject": {
    "driverLicense": {
      "type": "DriverLicense",
      "dateOfBirth": "01-01-1990",
      "issuingAuthority": "TX"
    }
  },
  "proof": {
    "type": "DataIntegrityProof",
    "created": "2023-06-04T22:35:08.444Z",
    "cryptosuite": "di-sd-urdna2015-jose-2042",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:web:txdmv.gov#urn:ietf:params:oauth:jwk-thumbprint:sha-256:MggqrOi2MEJR1qOeF8Q9gKRxUNB9vrjbwqogJ1Er8k8",
    "keys": [
      {
        "kid": "#disclosure",
        "kty": "EC",
        "crv": "P-256",
        "alg": "ES256",
        "x": "jYId68wSRiE4juVnaWW0V6BcJ_ZDItX12XUMc70lkmU",
        "y": "Mmnw8koRUqgIx4IAt5xpEgewa0LZ6qnM0k10gya9opE",
        "claimset_formats_supported": [
          "w3cvc-jsonld"
        ],
        "claimset_claims_supported": [
          "/credentialSubject/driverLicense/issuingAuthority"
        ]
      },
      {
        "kid": "#hmac",
        "kty": "oct",
        "alg": "HS256",
        "use": "sig",
        "key_ops": [
          "sign"
        ],
        "k": "hel_3wNuO5XYf-qs9-WiwWvC3vF8Ex0DisC_Lf924zI"
      },
      {
        "kid": "#mandatory",
        "kty": "oct",
        "k": "Kkchlbnz5M0gUEmsvqHWY1d0gYR3Gjzh5DTivzD7UVk"
      },
      {
        "kid": "#proof",
        "kty": "oct",
        "k": "N3ZIo4DTV7KVVThNNMceBE9eQKWpoKkCBXdyseM2_ok"
      }
    ],
    "signature": "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..AmwQsW61wdJDUvJjtuZ5sEFfnJWXvfjF3vGWE6FEWf-WbuvRZvYIZpee-c6h_7HP2MSnXw9nTPLxn5ucwokbsQ",
    "signatures": [
      "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..b3nmlkqKvnD39gqid49_HQ5tDyayr8l_AdfEGEixwM9u196Plf67axDNnoMC5ClL9exxqC21EbQgGYPYEp_EhA"
    ],
    "labels": {
      "c14n0": "uhpi1o2MvbeI9x3_F6bpLSmftQdig1cXdNW_NiNiuP_Q",
      "c14n1": "uNS9T1kHYBBJmLJdaBbA7oRgUqMexnkQfkZHWCdOb9gw",
      "c14n2": "uQtjiCdede86tckejVMZcZ3mOW-7z3n_D8lY5x7Jn_iE"
    },
    "mandatoryIndexes": [
      "0",
      "1",
      "2",
      "3",
      "5",
      "6"
    ]
  }
}
```

##### Verification
```json
{
  "verified": true,
  "document": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.txdmv.gov/credentials/v1",
      "https://w3id.org/security/data-integrity/v1"
    ],
    "type": [
      "VerifiableCredential",
      "DriverLicenseCredential"
    ],
    "credentialSubject": {
      "driverLicense": {
        "type": "DriverLicense",
        "dateOfBirth": "01-01-1990",
        "issuingAuthority": "TX"
      }
    }
  }
}
```

</details>



<details>
<summary>ES384</summary>

##### Controller
```json
{
  "id": "did:jwk:eyJrdHkiOiJFQyIsImNydiI6IlAtMzg0IiwiYWxnIjoiRVMzODQiLCJ4IjoiX1BLaWZSc3RqRDZLUnBlYjlzSnRYWVBPUXBocTQwUDlndEFHOG01VG1RMy0xLWY0c3AxVElBU0pHWjdQUmJTTCIsInkiOiJzMzV1YlFJUGp4Y1FiajR5LU42dlF3V3BEcmRQM1JWdHNsOHhHSjk3RG9yUjFXM2FYdkhmOU1lUTVVLWFDVDhoIn0#0",
  "type": "JsonWebKey",
  "controller": "did:jwk:eyJrdHkiOiJFQyIsImNydiI6IlAtMzg0IiwiYWxnIjoiRVMzODQiLCJ4IjoiX1BLaWZSc3RqRDZLUnBlYjlzSnRYWVBPUXBocTQwUDlndEFHOG01VG1RMy0xLWY0c3AxVElBU0pHWjdQUmJTTCIsInkiOiJzMzV1YlFJUGp4Y1FiajR5LU42dlF3V3BEcmRQM1JWdHNsOHhHSjk3RG9yUjFXM2FYdkhmOU1lUTVVLWFDVDhoIn0",
  "publicKeyJwk": {
    "kty": "EC",
    "crv": "P-384",
    "alg": "ES384",
    "x": "_PKifRstjD6KRpeb9sJtXYPOQphq40P9gtAG8m5TmQ3-1-f4sp1TIASJGZ7PRbSL",
    "y": "s35ubQIPjxcQbj4y-N6vQwWpDrdP3RVtsl8xGJ97DorR1W3aXvHf9MeQ5U-aCT8h"
  },
  "privateKeyJwk": {
    "kty": "EC",
    "crv": "P-384",
    "alg": "ES384",
    "x": "_PKifRstjD6KRpeb9sJtXYPOQphq40P9gtAG8m5TmQ3-1-f4sp1TIASJGZ7PRbSL",
    "y": "s35ubQIPjxcQbj4y-N6vQwWpDrdP3RVtsl8xGJ97DorR1W3aXvHf9MeQ5U-aCT8h",
    "d": "7lY6gqws9sR1Wb01c-mjuiZaOXWcSi7SeVzzZfcLrZPEs2QR75ZBHLp_oQPZ1sAz"
  }
}
```

##### Credential
```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.txdmv.gov/credentials/v1",
    "https://w3id.org/security/data-integrity/v1"
  ],
  "type": [
    "VerifiableCredential",
    "DriverLicenseCredential"
  ],
  "issuer": "did:web:txdmv.gov",
  "issuanceDate": "2010-01-01T19:23:24Z",
  "credentialSubject": {
    "driverLicense": {
      "type": "DriverLicense",
      "documentIdentifier": "T21387yc328c7y32h23f23",
      "dateOfBirth": "01-01-1990",
      "expirationDate": "01-01-2030",
      "issuingAuthority": "TX"
    }
  },
  "proof": {
    "type": "DataIntegrityProof",
    "created": "2023-06-04T22:35:08.444Z",
    "cryptosuite": "di-sd-urdna2015-jose-2042",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:web:txdmv.gov#urn:ietf:params:oauth:jwk-thumbprint:sha-256:MggqrOi2MEJR1qOeF8Q9gKRxUNB9vrjbwqogJ1Er8k8",
    "keys": [
      {
        "kid": "#disclosure",
        "kty": "EC",
        "crv": "P-384",
        "alg": "ES384",
        "x": "qdcRfjuILGDccRJH5d2BVCUrGLV2Qxh4_kXawAzgw6sDgYflZffcZ8hpkbd87Kql",
        "y": "o5rnvL5NSg16U9jC4clsDvRIGTbIz41UEb6fX9FBG1B0iWc53VNhDxB81CM7pAic",
        "claimset_formats_supported": [
          "w3cvc-jsonld"
        ],
        "claimset_claims_supported": [
          "/credentialSubject/driverLicense/issuingAuthority"
        ]
      },
      {
        "kid": "#hmac",
        "kty": "oct",
        "alg": "HS256",
        "use": "sig",
        "key_ops": [
          "sign"
        ],
        "k": "GKjIVq5TKq9lVcR0_qAtUEM2BokHjNvMK9zkCeL6STM"
      },
      {
        "kid": "#mandatory",
        "kty": "oct",
        "k": "E9gLXnMniQt2qCvUj5RPaFivYWQK6avP-uCcgpj8Q9o"
      },
      {
        "kid": "#proof",
        "kty": "oct",
        "k": "N3ZIo4DTV7KVVThNNMceBE9eQKWpoKkCBXdyseM2_ok"
      }
    ],
    "signature": "eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..n1TuMczCJj3Bf74cI64g8XYsUufrHUgpd67XusfRhaplMh6WwEmoWHXELd9ve-u10yhuRS1g8KawS11Ne-FlKmaSc7XebEWJnte3RivG4aLQ_vPIw-wLmasiULjcTKhr",
    "signatures": [
      "eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..ERNy2SubB9NpNRR0CkQXDFP1jHeQ1cmV0sv_KF-GXzak4KC_Oh32DutPllzShq4EuKnydPjZhgbUIPD9BRoOyNtz3jHIh9aQjgY95vc-7KJhAFBMGnBCO1m3quQ-nngu",
      "eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..Nx3-nf8bDAImF7XbipVDBseYEzz2rG7vITQuHw8Zk8zvxfE5nHLTst-tDdt5HHPo1Wxod__u8ZGitxk3fD9Sg0gII7mB2_LbfCzXV1FG17w3ypnP45JqI22llZLl3xOB",
      "eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..hXmNSJPi60KVS6n9dn0KJ8_zm8_Pl5U1JGUb9gw2Mgzo7ZKkB77bE08zpXqc-OKLS_GYYKUvk1iOkJ3CONdwmKST-by1dXMy7aKn-4Ug9IuP0TtSUMOwllcBtE_kO7vb",
      "eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..SpLkve18fVU4X08RvwBFz1s_u1fpFR-qeeOIS9nR8uUsXPpIWhVG0rF2lGuRbPAPYNDpab0sEt1WGBbF5jKWBJMGJjL49aJLrkLm1CVmp6uvBGIIQHTF5PX7ji4Yb8Ku",
      "eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..AzQSLXx3qu2tS4I6RQKSFdiTiy9WMMBsWQjqM6co4HZ-x7k4YxGkg-so9CSHyVVA5Ww1alKG4twToPNfurvZZPupkAxvKa7HQdYUfNkhINfPVc_R-vmyNSJ46ujGW0Ze"
    ]
  }
}
```

##### Presentation
```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.txdmv.gov/credentials/v1",
    "https://w3id.org/security/data-integrity/v1"
  ],
  "type": [
    "VerifiableCredential",
    "DriverLicenseCredential"
  ],
  "credentialSubject": {
    "driverLicense": {
      "type": "DriverLicense",
      "dateOfBirth": "01-01-1990",
      "issuingAuthority": "TX"
    }
  },
  "proof": {
    "type": "DataIntegrityProof",
    "created": "2023-06-04T22:35:08.444Z",
    "cryptosuite": "di-sd-urdna2015-jose-2042",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:web:txdmv.gov#urn:ietf:params:oauth:jwk-thumbprint:sha-256:MggqrOi2MEJR1qOeF8Q9gKRxUNB9vrjbwqogJ1Er8k8",
    "keys": [
      {
        "kid": "#disclosure",
        "kty": "EC",
        "crv": "P-384",
        "alg": "ES384",
        "x": "qdcRfjuILGDccRJH5d2BVCUrGLV2Qxh4_kXawAzgw6sDgYflZffcZ8hpkbd87Kql",
        "y": "o5rnvL5NSg16U9jC4clsDvRIGTbIz41UEb6fX9FBG1B0iWc53VNhDxB81CM7pAic",
        "claimset_formats_supported": [
          "w3cvc-jsonld"
        ],
        "claimset_claims_supported": [
          "/credentialSubject/driverLicense/issuingAuthority"
        ]
      },
      {
        "kid": "#hmac",
        "kty": "oct",
        "alg": "HS256",
        "use": "sig",
        "key_ops": [
          "sign"
        ],
        "k": "GKjIVq5TKq9lVcR0_qAtUEM2BokHjNvMK9zkCeL6STM"
      },
      {
        "kid": "#mandatory",
        "kty": "oct",
        "k": "E9gLXnMniQt2qCvUj5RPaFivYWQK6avP-uCcgpj8Q9o"
      },
      {
        "kid": "#proof",
        "kty": "oct",
        "k": "N3ZIo4DTV7KVVThNNMceBE9eQKWpoKkCBXdyseM2_ok"
      }
    ],
    "signature": "eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..n1TuMczCJj3Bf74cI64g8XYsUufrHUgpd67XusfRhaplMh6WwEmoWHXELd9ve-u10yhuRS1g8KawS11Ne-FlKmaSc7XebEWJnte3RivG4aLQ_vPIw-wLmasiULjcTKhr",
    "signatures": [
      "eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..ERNy2SubB9NpNRR0CkQXDFP1jHeQ1cmV0sv_KF-GXzak4KC_Oh32DutPllzShq4EuKnydPjZhgbUIPD9BRoOyNtz3jHIh9aQjgY95vc-7KJhAFBMGnBCO1m3quQ-nngu"
    ],
    "labels": {
      "c14n0": "ucRDH5ynrwXddCiA6XMMehGBi_vfkQRATWdSuB3jVncc",
      "c14n1": "ujUK8o4kwI2TvScWu7C97s_ppTZ3lLWc-M-5Zwq_OS0Q",
      "c14n2": "uVBbOqjaiw4wgaN90s088ra7GwGxNpeDH4p-tq_QgKFE"
    },
    "mandatoryIndexes": [
      "0",
      "2",
      "3",
      "4",
      "5",
      "6"
    ]
  }
}
```

##### Verification
```json
{
  "verified": true,
  "document": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.txdmv.gov/credentials/v1",
      "https://w3id.org/security/data-integrity/v1"
    ],
    "type": [
      "VerifiableCredential",
      "DriverLicenseCredential"
    ],
    "credentialSubject": {
      "driverLicense": {
        "type": "DriverLicense",
        "dateOfBirth": "01-01-1990",
        "issuingAuthority": "TX"
      }
    }
  }
}
```

</details>



<details>
<summary>RS256</summary>

##### Controller
```json
{
  "id": "did:jwk:eyJrdHkiOiJSU0EiLCJhbGciOiJSUzI1NiIsIm4iOiJwMjc0Z0JIZVVqa1pMekNwTURMYzJLYXFrcTdGYnIwWWV4TXAzWjRrSFA1NGV4MFRxQUFjNEdrSWlCUjVPOGpxNTFzUDd5b08wRW9wTFJhT21BY0dPTFlXSlg5QkFKUG1IN016dGJ5UEEzU3ZzdzBfZVJTM3JFd0pPa1JISXRRUmpkOFU4eWNnNDVnNHRGZkFmUWdneGczb2FhS3M2am1aUXJfclM0VHU4QnNCVXNkbEJYb1FQOTRfRUxYM0RUQklaVXhOMFBSekVPaXZaZERpc2VrRVVWUUFMLVNqT3hlOGhSb2xXOERUYXBxMXRnZWxqTjRIZUc1VmZqdExHNVRkWmhHdlFYNnRYb0hxRDczRTlLUlBaOEFvcV95VWpwYXBLZnpORzVJNGxZbktYRFdwVG94UHBKZjlWLWdKRW0tdlY4Z21QQXdobkk5UDdZUlZzRVVYSlEiLCJlIjoiQVFBQiJ9#0",
  "type": "JsonWebKey",
  "controller": "did:jwk:eyJrdHkiOiJSU0EiLCJhbGciOiJSUzI1NiIsIm4iOiJwMjc0Z0JIZVVqa1pMekNwTURMYzJLYXFrcTdGYnIwWWV4TXAzWjRrSFA1NGV4MFRxQUFjNEdrSWlCUjVPOGpxNTFzUDd5b08wRW9wTFJhT21BY0dPTFlXSlg5QkFKUG1IN016dGJ5UEEzU3ZzdzBfZVJTM3JFd0pPa1JISXRRUmpkOFU4eWNnNDVnNHRGZkFmUWdneGczb2FhS3M2am1aUXJfclM0VHU4QnNCVXNkbEJYb1FQOTRfRUxYM0RUQklaVXhOMFBSekVPaXZaZERpc2VrRVVWUUFMLVNqT3hlOGhSb2xXOERUYXBxMXRnZWxqTjRIZUc1VmZqdExHNVRkWmhHdlFYNnRYb0hxRDczRTlLUlBaOEFvcV95VWpwYXBLZnpORzVJNGxZbktYRFdwVG94UHBKZjlWLWdKRW0tdlY4Z21QQXdobkk5UDdZUlZzRVVYSlEiLCJlIjoiQVFBQiJ9",
  "publicKeyJwk": {
    "kty": "RSA",
    "alg": "RS256",
    "n": "p274gBHeUjkZLzCpMDLc2Kaqkq7Fbr0YexMp3Z4kHP54ex0TqAAc4GkIiBR5O8jq51sP7yoO0EopLRaOmAcGOLYWJX9BAJPmH7MztbyPA3Svsw0_eRS3rEwJOkRHItQRjd8U8ycg45g4tFfAfQggxg3oaaKs6jmZQr_rS4Tu8BsBUsdlBXoQP94_ELX3DTBIZUxN0PRzEOivZdDisekEUVQAL-SjOxe8hRolW8DTapq1tgeljN4HeG5VfjtLG5TdZhGvQX6tXoHqD73E9KRPZ8Aoq_yUjpapKfzNG5I4lYnKXDWpToxPpJf9V-gJEm-vV8gmPAwhnI9P7YRVsEUXJQ",
    "e": "AQAB"
  },
  "privateKeyJwk": {
    "kty": "RSA",
    "alg": "RS256",
    "d": "FqUvz06GCwk1n_LNEeZHMAw2qhkg6IMtzPOWEtHL4O9anI1zC6KxmnkfkhwcG4W8nlGW0Z-WxP11cpIy81qRMQQQ8b2zgnWpHGTQhnDRckO1bG-gbpVqlCSX45K5gPs9a-VIquxXX-ube79vRYSJvjps_TXnJ39mfFHYa-yM-S9Nyx6StgESEzI-vcY1x7_XVlflOsBzHqFtDbwXL0BDxTdW-kqacL96HDCqvkc2nRj0JRzxCHReTuYql8wtzo1jCaootwz5RZRd_gBin9L5l7FXPfxDcH9Vev8SxBBqxyS8vRTP6vIQ4zL6MO47OyNsTPrLYhnexJ-uPNYlXjNVrw",
    "n": "p274gBHeUjkZLzCpMDLc2Kaqkq7Fbr0YexMp3Z4kHP54ex0TqAAc4GkIiBR5O8jq51sP7yoO0EopLRaOmAcGOLYWJX9BAJPmH7MztbyPA3Svsw0_eRS3rEwJOkRHItQRjd8U8ycg45g4tFfAfQggxg3oaaKs6jmZQr_rS4Tu8BsBUsdlBXoQP94_ELX3DTBIZUxN0PRzEOivZdDisekEUVQAL-SjOxe8hRolW8DTapq1tgeljN4HeG5VfjtLG5TdZhGvQX6tXoHqD73E9KRPZ8Aoq_yUjpapKfzNG5I4lYnKXDWpToxPpJf9V-gJEm-vV8gmPAwhnI9P7YRVsEUXJQ",
    "e": "AQAB",
    "p": "2Gow0TcDO4APa1UaarN9lBdH5MPEkKWWhrlO4_D2hISpNJc6fEW31M9NCgOfDM0fVW9sY27ELVqSRSlYBK_xkm9XzHJNebC--xaEY8xhis1kmGyCESf-unx-AYTX9RHnADAzJvldsQN5zNc4KlHXLBWj1_YOc_0jyjyvCP5gRhc",
    "q": "xg8v7tQvJ5ynocqgmdWYho-XLv7heaKZP_2vOI9CHXHDupJgNEqjxpVKv2gdPpz-ayDjwYphVyG4iPrbSU6GTYwTaYVHerh94D9wOfu0HFSIsoaM_WwHnNF5pFlzTUY9B4zWi_xzAsXW-JiC9ukba2LI4Xwmk_xgVa4C0MsTziM",
    "dp": "YGxv88efGROlyxzP-FqgySrWTYcsPYaJ2t0V2VmzfLfe7B-1X0lw7tCucpfKddmu7FII6QShQ9Pm-AnDvdLmv2f8posHGgE2Fomh0xVtIHsDJyaxjRNU26I8QlD-J6MiWWMgZ20T4Zq62hnKXJC6XloF9mMbbXKMT79Z_ZfZLWE",
    "dq": "W4VxFN-f2qIdJDpJ9EwrayK3LdRBxL9KKbPEYFJyrsB_PZueMQu8mmsqW0B1IxXQyxgrpqeXS3gdmc6xvjI3BWaRIdWgrijKofEuntyc4ep-MGDUjdZ5vhFeMH_VNAQc93wxOAaz7rgVGlL_UbFuJjVDtk50VTXuHimGy4zL3hk",
    "qi": "DYvHupg5yAosGna8HZ6_lNLhg5LrVPOSMDpT3obZw6Uek02QRVcuF_cLKB1-RD7DwdcvbfdGSE-Lc_zlAc2Ca9SLjUIYNRvKKuj2tDjMQhDrD5udZu4u53FXoS9dZbgxCuK3_2YyeQ_6oXO-ZJA-MpOdL8mNV1SZVvB8BQbNPio"
  }
}
```

##### Credential
```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.txdmv.gov/credentials/v1",
    "https://w3id.org/security/data-integrity/v1"
  ],
  "type": [
    "VerifiableCredential",
    "DriverLicenseCredential"
  ],
  "issuer": "did:web:txdmv.gov",
  "issuanceDate": "2010-01-01T19:23:24Z",
  "credentialSubject": {
    "driverLicense": {
      "type": "DriverLicense",
      "documentIdentifier": "T21387yc328c7y32h23f23",
      "dateOfBirth": "01-01-1990",
      "expirationDate": "01-01-2030",
      "issuingAuthority": "TX"
    }
  },
  "proof": {
    "type": "DataIntegrityProof",
    "created": "2023-06-04T22:35:08.444Z",
    "cryptosuite": "di-sd-urdna2015-jose-2042",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:web:txdmv.gov#urn:ietf:params:oauth:jwk-thumbprint:sha-256:MggqrOi2MEJR1qOeF8Q9gKRxUNB9vrjbwqogJ1Er8k8",
    "keys": [
      {
        "kid": "#disclosure",
        "kty": "RSA",
        "alg": "RS256",
        "n": "5u-OGAvOKsb3rKTzkoOfDwy8_FuPqLOTrG_TOjuJZ0WYppqGic5G2kplmRrF545LkLDByPM0b-wqAyOXX9D4Wnw1MYYKu1HXBSKtNPS8EERcEugAOBaKIaxsnuqkRwvQuD3lr45r_wl5cmET0hykrlo0RbQraBtT0UNdZONMJhaRI_SgSTLIFif0xlYeWomCKD8lZxoL-SEhPdwFD3SGxEUAafMl2hnYVo5l5DMovHXbaTSSMnEp5vjKmGsQRgpfyoZ9cEcs_rMFkivXIDsKrr_Rwh8j-RYPZQ-RJ-1HZaXe_Xg9RNEO9dqGb-HPSqgIfp-dUVO8RS-Z0FIK5g43hw",
        "e": "AQAB",
        "claimset_formats_supported": [
          "w3cvc-jsonld"
        ],
        "claimset_claims_supported": [
          "/credentialSubject/driverLicense/issuingAuthority"
        ]
      },
      {
        "kid": "#hmac",
        "kty": "oct",
        "alg": "HS256",
        "use": "sig",
        "key_ops": [
          "sign"
        ],
        "k": "qeujSHLj99wylx-FlJwkeQUj6g4lhQr2Feltutlm7FU"
      },
      {
        "kid": "#mandatory",
        "kty": "oct",
        "k": "e4vcW7aOa50yivDnkvycfzstGJUAxT0hFxyFAlsVvdo"
      },
      {
        "kid": "#proof",
        "kty": "oct",
        "k": "N3ZIo4DTV7KVVThNNMceBE9eQKWpoKkCBXdyseM2_ok"
      }
    ],
    "signature": "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..T2nJSHWOAaKQ1GIbrrkzQrfW_FyD-W-4laujZsBL4xHToDxAvOKNk5tXGH-XI9Bc86CjTHYPi_6CLZGplBAkJhMNp8LXnrICq9CwpQzMy-lwLxwbvudw_ZKtpzCx2NhcohhiV0HmURFmBw6xz7X3yE1t5_fwZWdGJKl116fEQuig1_gSKVA-3JmF4gH7r2_H7FPOcs0nCCdJYFNFtqfByWICdIt4tD7v2elBb6IpzjkCn-omzGaLhOjn95AyRiLuRMbbtb8VEitsJe0d64z0j39N3pAdNFouPyUFN7pAwmuwk0vHP70chMVIo1fRn7oA9RNOWIxkti2pHUkYIv9SKw",
    "signatures": [
      "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..r00kMskLRGy5qqpXrfy21ZdxNbM9WP-U3s5Tlbhy0QG_zdBaspTHKDPiHjUs4I-rIIZIiMo7CRfX-mRfwc40wgl-ld45xORnJQPA6klu5jbMOjcfrfrRAuU21nLdWKS20J9jRJHnb-_eGOn2rVidmxmlTHvE17_xTKtLKuKv3AzSxDQpQIDtwTHCf31SS0JDoGc9PeEbqIAsEBM_lFWcCRndHkYa8THZxefFV4nQD7HeAMd7tAY4FolnIdugE4XOXb3aQuyHosTxzRnTtxMrW9NGG9I86g8qQx3C4r3mPLTjlmrnSffIUFKO2MsBVHIiDP-EOVVoUPt979S7joM6TA",
      "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..2iqnsESFPdpAf6g4dwayHj-K5Thp4zVmHIDgidouMIfAWSaUCeGdkmzwyBAJPHqzk39qZ2wXphKnVtVlMPgC8CORIdZZ7nEBpokmZJq82pTGa1dd4Kq2e1sB0xNlHI6iCB6ICOzhNLbVmcHXquAXF97XyttoU3uKbYXlYwf6102i9U2AC6puJq_4L75DfAMDjj1wCi2J3L41kGqyKQ7u1wzP09qJg8piztLNqpYuQDxCpV6KRLFQl5kBbluRyu9j74iWWx0Zpw5He2i7ryVcvPdx9f9Sm-34eeBo_ZE9E4LOPOQwCGTf7_pT1UZDsLgogn3JNxF3QY9Lcb9s7s0pug",
      "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..voZJEqTMuRweIyb8_au-pIBntu6S5yca-Esf4UtIgcA6R5ciygxT8yOWA3Q5rXUZLO-YH5AOTmPv7QRcDzbaOyOUyRNcRsdw7WYyuvPS4kwl8l0JxxmrsuIhSWPjNwOegCRkwhhxVSKo_ITyKvXw-Qjdd1phUEeu5lxiRm3x0mweOC5KpzLEejsGIrhuX6O1pUKlCtf5ns12vTgX-v2N48yclFP0hWHsdxRJMyBTifLqlDA0d1zUGqZhDczAcZiIltFgvj4EIHhm2UWovjnKNlAuYtqgzHc_3H41B-LBYW2CH9n5I4jczRt2CCOik_8u4WezuLaXon4--UJsURg3oQ",
      "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..n08-NwrMVxIqVL3BitJS3HA3FtaQZjsXuBGyL6IjencOnXDiC0b1OF1N5WA5v-o8w5lw5fcr-FinI17ccBxkQ_LymaiyXUeHdNCheb59qdVEIB_m3oHOkAz51MDqJW7ss7FUMibWLtzhES1rbvT2eAcXgXiqA6QvWGMI3Apf69glLbT7E-XZdPqGhc1SB4p4x-NAWNRcforBNK66pIvtbc_PfQal7RDElIxhkVfr_1ucYEjMdUkArHpVTflwRfiLXprNvKTiKvai8uUW2qo8Rx4eLKMB-t_c6ISZqifvtSvbJD90xur-cGfLiS4tgPUoVy9SqtWJtkGUC4M7aMUynQ",
      "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..SamYrIgce-4G4HDoSDPKiWRHIi6Kr8F3pE3LRlqdkqjiSO3eSjuye2m6EWnPir1k-SZ5l5wGBphVc64sPZXSdKKfZfJ5xd5pfALv_XoDtLdEdufWei5uKD0NuyXdogfU2uWI9IT75MsiEibKDkccovG2eyybInPFZQ-rMEEDQYwnYS_9I7lhCxCCc0fDSRpWij0cCBhCBLQiGj9qFwgQnR8I6EJCpaOOUnO5rdLHOBTmjuWwNVa1q2KUC5FuWq1619SphjtvD0tKgNUIQs4snGZOXQhJ_ZNHp-UZEVqSy2WaV4ClPANLKKg7ESyN4oolAVXzh7CCfKQvQ3Sd9FafhQ"
    ]
  }
}
```

##### Presentation
```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.txdmv.gov/credentials/v1",
    "https://w3id.org/security/data-integrity/v1"
  ],
  "type": [
    "VerifiableCredential",
    "DriverLicenseCredential"
  ],
  "credentialSubject": {
    "driverLicense": {
      "type": "DriverLicense",
      "dateOfBirth": "01-01-1990",
      "issuingAuthority": "TX"
    }
  },
  "proof": {
    "type": "DataIntegrityProof",
    "created": "2023-06-04T22:35:08.444Z",
    "cryptosuite": "di-sd-urdna2015-jose-2042",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:web:txdmv.gov#urn:ietf:params:oauth:jwk-thumbprint:sha-256:MggqrOi2MEJR1qOeF8Q9gKRxUNB9vrjbwqogJ1Er8k8",
    "keys": [
      {
        "kid": "#disclosure",
        "kty": "RSA",
        "alg": "RS256",
        "n": "5u-OGAvOKsb3rKTzkoOfDwy8_FuPqLOTrG_TOjuJZ0WYppqGic5G2kplmRrF545LkLDByPM0b-wqAyOXX9D4Wnw1MYYKu1HXBSKtNPS8EERcEugAOBaKIaxsnuqkRwvQuD3lr45r_wl5cmET0hykrlo0RbQraBtT0UNdZONMJhaRI_SgSTLIFif0xlYeWomCKD8lZxoL-SEhPdwFD3SGxEUAafMl2hnYVo5l5DMovHXbaTSSMnEp5vjKmGsQRgpfyoZ9cEcs_rMFkivXIDsKrr_Rwh8j-RYPZQ-RJ-1HZaXe_Xg9RNEO9dqGb-HPSqgIfp-dUVO8RS-Z0FIK5g43hw",
        "e": "AQAB",
        "claimset_formats_supported": [
          "w3cvc-jsonld"
        ],
        "claimset_claims_supported": [
          "/credentialSubject/driverLicense/issuingAuthority"
        ]
      },
      {
        "kid": "#hmac",
        "kty": "oct",
        "alg": "HS256",
        "use": "sig",
        "key_ops": [
          "sign"
        ],
        "k": "qeujSHLj99wylx-FlJwkeQUj6g4lhQr2Feltutlm7FU"
      },
      {
        "kid": "#mandatory",
        "kty": "oct",
        "k": "e4vcW7aOa50yivDnkvycfzstGJUAxT0hFxyFAlsVvdo"
      },
      {
        "kid": "#proof",
        "kty": "oct",
        "k": "N3ZIo4DTV7KVVThNNMceBE9eQKWpoKkCBXdyseM2_ok"
      }
    ],
    "signature": "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..T2nJSHWOAaKQ1GIbrrkzQrfW_FyD-W-4laujZsBL4xHToDxAvOKNk5tXGH-XI9Bc86CjTHYPi_6CLZGplBAkJhMNp8LXnrICq9CwpQzMy-lwLxwbvudw_ZKtpzCx2NhcohhiV0HmURFmBw6xz7X3yE1t5_fwZWdGJKl116fEQuig1_gSKVA-3JmF4gH7r2_H7FPOcs0nCCdJYFNFtqfByWICdIt4tD7v2elBb6IpzjkCn-omzGaLhOjn95AyRiLuRMbbtb8VEitsJe0d64z0j39N3pAdNFouPyUFN7pAwmuwk0vHP70chMVIo1fRn7oA9RNOWIxkti2pHUkYIv9SKw",
    "signatures": [
      "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..voZJEqTMuRweIyb8_au-pIBntu6S5yca-Esf4UtIgcA6R5ciygxT8yOWA3Q5rXUZLO-YH5AOTmPv7QRcDzbaOyOUyRNcRsdw7WYyuvPS4kwl8l0JxxmrsuIhSWPjNwOegCRkwhhxVSKo_ITyKvXw-Qjdd1phUEeu5lxiRm3x0mweOC5KpzLEejsGIrhuX6O1pUKlCtf5ns12vTgX-v2N48yclFP0hWHsdxRJMyBTifLqlDA0d1zUGqZhDczAcZiIltFgvj4EIHhm2UWovjnKNlAuYtqgzHc_3H41B-LBYW2CH9n5I4jczRt2CCOik_8u4WezuLaXon4--UJsURg3oQ"
    ],
    "labels": {
      "c14n0": "uJg9MLzMRpqwBsPedJCK5eL9lclSKB7bJApRJ1WYxxmc",
      "c14n1": "uAmAeBEZCl5UQztXMFKbFnGNGH9Gs1DWhxugi_ngxPZw",
      "c14n2": "uceHnwQlfEjc-GyNcM1DOgrqCOkzkwVCIfH6UZmUzskk"
    },
    "mandatoryIndexes": [
      "0",
      "1",
      "2",
      "3",
      "4",
      "6"
    ]
  }
}
```

##### Verification
```json
{
  "verified": true,
  "document": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.txdmv.gov/credentials/v1",
      "https://w3id.org/security/data-integrity/v1"
    ],
    "type": [
      "VerifiableCredential",
      "DriverLicenseCredential"
    ],
    "credentialSubject": {
      "driverLicense": {
        "type": "DriverLicense",
        "dateOfBirth": "01-01-1990",
        "issuingAuthority": "TX"
      }
    }
  }
}
```

</details>



<details>
<summary>ES256K</summary>

##### Controller
```json
{
  "id": "did:jwk:eyJrdHkiOiJFQyIsImNydiI6InNlY3AyNTZrMSIsImFsZyI6IkVTMjU2SyIsIngiOiJobU9xRXRrakJSbGgyQ0VkR0RrNTVKSGZ5bE43dTF1NHU4VU9RcXFzYlRJIiwieSI6ImhJWGphcEpHQ0o3QVB3UVFpSHpPZ0JsX3BScjFORzNZRUVidDN6RGVnNjQifQ#0",
  "type": "JsonWebKey",
  "controller": "did:jwk:eyJrdHkiOiJFQyIsImNydiI6InNlY3AyNTZrMSIsImFsZyI6IkVTMjU2SyIsIngiOiJobU9xRXRrakJSbGgyQ0VkR0RrNTVKSGZ5bE43dTF1NHU4VU9RcXFzYlRJIiwieSI6ImhJWGphcEpHQ0o3QVB3UVFpSHpPZ0JsX3BScjFORzNZRUVidDN6RGVnNjQifQ",
  "publicKeyJwk": {
    "kty": "EC",
    "crv": "secp256k1",
    "alg": "ES256K",
    "x": "hmOqEtkjBRlh2CEdGDk55JHfylN7u1u4u8UOQqqsbTI",
    "y": "hIXjapJGCJ7APwQQiHzOgBl_pRr1NG3YEEbt3zDeg64"
  },
  "privateKeyJwk": {
    "kty": "EC",
    "crv": "secp256k1",
    "alg": "ES256K",
    "x": "hmOqEtkjBRlh2CEdGDk55JHfylN7u1u4u8UOQqqsbTI",
    "y": "hIXjapJGCJ7APwQQiHzOgBl_pRr1NG3YEEbt3zDeg64",
    "d": "9B8Jbae1FXZUjGJtm8_9uM3xvz_SpziYfsRrf5-Frow"
  }
}
```

##### Credential
```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.txdmv.gov/credentials/v1",
    "https://w3id.org/security/data-integrity/v1"
  ],
  "type": [
    "VerifiableCredential",
    "DriverLicenseCredential"
  ],
  "issuer": "did:web:txdmv.gov",
  "issuanceDate": "2010-01-01T19:23:24Z",
  "credentialSubject": {
    "driverLicense": {
      "type": "DriverLicense",
      "documentIdentifier": "T21387yc328c7y32h23f23",
      "dateOfBirth": "01-01-1990",
      "expirationDate": "01-01-2030",
      "issuingAuthority": "TX"
    }
  },
  "proof": {
    "type": "DataIntegrityProof",
    "created": "2023-06-04T22:35:08.444Z",
    "cryptosuite": "di-sd-urdna2015-jose-2042",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:web:txdmv.gov#urn:ietf:params:oauth:jwk-thumbprint:sha-256:MggqrOi2MEJR1qOeF8Q9gKRxUNB9vrjbwqogJ1Er8k8",
    "keys": [
      {
        "kid": "#disclosure",
        "kty": "EC",
        "crv": "secp256k1",
        "alg": "ES256K",
        "x": "iBqN3VBgNMsmXO8__gIjUFR5kKL7TZPzL2EzzrdwwL0",
        "y": "Yil3wIACuUntVN5dPb4_EP3ghP9WnPPu6S2OCbypSIg",
        "claimset_formats_supported": [
          "w3cvc-jsonld"
        ],
        "claimset_claims_supported": [
          "/credentialSubject/driverLicense/issuingAuthority"
        ]
      },
      {
        "kid": "#hmac",
        "kty": "oct",
        "alg": "HS256",
        "use": "sig",
        "key_ops": [
          "sign"
        ],
        "k": "mUBDOY1ia6d3Hlg89qhR1XgZHGtMDty4AogLkTwM7kk"
      },
      {
        "kid": "#mandatory",
        "kty": "oct",
        "k": "lU2N3hheWdm_llvsagBcstFqsU9ZDjL6s0bTg98jsoo"
      },
      {
        "kid": "#proof",
        "kty": "oct",
        "k": "N3ZIo4DTV7KVVThNNMceBE9eQKWpoKkCBXdyseM2_ok"
      }
    ],
    "signature": "eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..k0XZ5MtFKPyGFLXZJhy0QCdS7FPcyvZCMNtlMqy7hNzt74r8JGLBu0mcOAt0ZnMNlrHTDwPs48iWzxp72kRAIw",
    "signatures": [
      "eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..8S5jeC6W7AbeS4VluI_L3UuDR31R8oIE4VUYOzHcoS4OFVCU2erlWRl8WN_RvwY0RYGQ0bwy430-BUGLtF0nkQ",
      "eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..Xi8C__CjzGoavhrVr9uAJJdESsbu57z45UaG0fVZpr8ogSjvRR6cqEcedpCndsi7WN4HQjFpks4cOUBy5R8zYA",
      "eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..wjKTa2lHdwY4WX8mIH5E3fz6uVUhurVUGHgMkGdzrKCdjLdeRuSz-pTaLYNZ6L6qtiMGFb9A4cZEW7H8JVzQyA",
      "eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ.._0O9pMEv7LpzzRxXWjKVh3uQxgkZi5hA96frpYBzxYKkRfEJq9zZGKTPlvbzSFo3J2zw5rHLPyY0thr_1BL6Ug",
      "eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..PasVNpHrdgiyuZVTLIkr8xkgrdow31jayI5LHdcsY5fhvWEjh7TXWOMmD90u7TvZ68dbcomSASiRK5O5_tWQ1w"
    ]
  }
}
```

##### Presentation
```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.txdmv.gov/credentials/v1",
    "https://w3id.org/security/data-integrity/v1"
  ],
  "type": [
    "VerifiableCredential",
    "DriverLicenseCredential"
  ],
  "credentialSubject": {
    "driverLicense": {
      "type": "DriverLicense",
      "dateOfBirth": "01-01-1990",
      "issuingAuthority": "TX"
    }
  },
  "proof": {
    "type": "DataIntegrityProof",
    "created": "2023-06-04T22:35:08.444Z",
    "cryptosuite": "di-sd-urdna2015-jose-2042",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:web:txdmv.gov#urn:ietf:params:oauth:jwk-thumbprint:sha-256:MggqrOi2MEJR1qOeF8Q9gKRxUNB9vrjbwqogJ1Er8k8",
    "keys": [
      {
        "kid": "#disclosure",
        "kty": "EC",
        "crv": "secp256k1",
        "alg": "ES256K",
        "x": "iBqN3VBgNMsmXO8__gIjUFR5kKL7TZPzL2EzzrdwwL0",
        "y": "Yil3wIACuUntVN5dPb4_EP3ghP9WnPPu6S2OCbypSIg",
        "claimset_formats_supported": [
          "w3cvc-jsonld"
        ],
        "claimset_claims_supported": [
          "/credentialSubject/driverLicense/issuingAuthority"
        ]
      },
      {
        "kid": "#hmac",
        "kty": "oct",
        "alg": "HS256",
        "use": "sig",
        "key_ops": [
          "sign"
        ],
        "k": "mUBDOY1ia6d3Hlg89qhR1XgZHGtMDty4AogLkTwM7kk"
      },
      {
        "kid": "#mandatory",
        "kty": "oct",
        "k": "lU2N3hheWdm_llvsagBcstFqsU9ZDjL6s0bTg98jsoo"
      },
      {
        "kid": "#proof",
        "kty": "oct",
        "k": "N3ZIo4DTV7KVVThNNMceBE9eQKWpoKkCBXdyseM2_ok"
      }
    ],
    "signature": "eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..k0XZ5MtFKPyGFLXZJhy0QCdS7FPcyvZCMNtlMqy7hNzt74r8JGLBu0mcOAt0ZnMNlrHTDwPs48iWzxp72kRAIw",
    "signatures": [
      "eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..wjKTa2lHdwY4WX8mIH5E3fz6uVUhurVUGHgMkGdzrKCdjLdeRuSz-pTaLYNZ6L6qtiMGFb9A4cZEW7H8JVzQyA"
    ],
    "labels": {
      "c14n0": "uh2C_6-ex0gEBu5vr6c1RmYIGSUTHq_Fa32J748f00DI",
      "c14n1": "uj6S9LUxdROe5QarydZb3H89t6OiKZb8udmSCgJu0Hy0",
      "c14n2": "uw-aZA-0wwSbl9PKpxugJo_SanAgigkF5v-b3aqzs_V8"
    },
    "mandatoryIndexes": [
      "0",
      "1",
      "2",
      "3",
      "4",
      "6"
    ]
  }
}
```

##### Verification
```json
{
  "verified": true,
  "document": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.txdmv.gov/credentials/v1",
      "https://w3id.org/security/data-integrity/v1"
    ],
    "type": [
      "VerifiableCredential",
      "DriverLicenseCredential"
    ],
    "credentialSubject": {
      "driverLicense": {
        "type": "DriverLicense",
        "dateOfBirth": "01-01-1990",
        "issuingAuthority": "TX"
      }
    }
  }
}
```

</details>



<details>
<summary>EdDSA</summary>

##### Controller
```json
{
  "id": "did:jwk:eyJrdHkiOiJPS1AiLCJjcnYiOiJFZDI1NTE5IiwiYWxnIjoiRWREU0EiLCJ4IjoicjAxX2VkT2l1WVFyS0pjTjU1T3dRcnZuTWlWMldXUXJwSHZjSXJ1eUFaVSJ9#0",
  "type": "JsonWebKey",
  "controller": "did:jwk:eyJrdHkiOiJPS1AiLCJjcnYiOiJFZDI1NTE5IiwiYWxnIjoiRWREU0EiLCJ4IjoicjAxX2VkT2l1WVFyS0pjTjU1T3dRcnZuTWlWMldXUXJwSHZjSXJ1eUFaVSJ9",
  "publicKeyJwk": {
    "kty": "OKP",
    "crv": "Ed25519",
    "alg": "EdDSA",
    "x": "r01_edOiuYQrKJcN55OwQrvnMiV2WWQrpHvcIruyAZU"
  },
  "privateKeyJwk": {
    "kty": "OKP",
    "crv": "Ed25519",
    "alg": "EdDSA",
    "x": "r01_edOiuYQrKJcN55OwQrvnMiV2WWQrpHvcIruyAZU",
    "d": "IjXC0D0RMnScAVE_AN0pqzIq-qSA2Tp5IJ7ws_sKpoI"
  }
}
```

##### Credential
```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.txdmv.gov/credentials/v1",
    "https://w3id.org/security/data-integrity/v1"
  ],
  "type": [
    "VerifiableCredential",
    "DriverLicenseCredential"
  ],
  "issuer": "did:web:txdmv.gov",
  "issuanceDate": "2010-01-01T19:23:24Z",
  "credentialSubject": {
    "driverLicense": {
      "type": "DriverLicense",
      "documentIdentifier": "T21387yc328c7y32h23f23",
      "dateOfBirth": "01-01-1990",
      "expirationDate": "01-01-2030",
      "issuingAuthority": "TX"
    }
  },
  "proof": {
    "type": "DataIntegrityProof",
    "created": "2023-06-04T22:35:08.444Z",
    "cryptosuite": "di-sd-urdna2015-jose-2042",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:web:txdmv.gov#urn:ietf:params:oauth:jwk-thumbprint:sha-256:MggqrOi2MEJR1qOeF8Q9gKRxUNB9vrjbwqogJ1Er8k8",
    "keys": [
      {
        "kid": "#disclosure",
        "kty": "OKP",
        "crv": "Ed25519",
        "alg": "EdDSA",
        "x": "LJ3Hg9AxvtBvbaJbFdQVPqC0cNN16BAW2gI7x3j3ONI",
        "claimset_formats_supported": [
          "w3cvc-jsonld"
        ],
        "claimset_claims_supported": [
          "/credentialSubject/driverLicense/issuingAuthority"
        ]
      },
      {
        "kid": "#hmac",
        "kty": "oct",
        "alg": "HS256",
        "use": "sig",
        "key_ops": [
          "sign"
        ],
        "k": "6ecVU3RkxsgqsrwnokiaJKrzKpSJ_7ZQM_-VzOWVJN8"
      },
      {
        "kid": "#mandatory",
        "kty": "oct",
        "k": "R6PqMcxibm3QUtwoPSMXKbQo54d_vgyLaupafIYTUdI"
      },
      {
        "kid": "#proof",
        "kty": "oct",
        "k": "N3ZIo4DTV7KVVThNNMceBE9eQKWpoKkCBXdyseM2_ok"
      }
    ],
    "signature": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..cx9pLJE11YOgZCKbkxDA37tNXOZUK2ddvVzEwMo9ww9RVuRkFtk3Iw8nXA_3VOz_QMQjPXVtHWPa5lSIejczCQ",
    "signatures": [
      "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..kt_z9lA_4SmmtFitSrE1VZCJovN_UF1K2o-s21DBuYfXt_Yd7ZMcgPIa2I9Ef4gaYF3nem0bp3C7PwOaARKkAw",
      "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..oMJxvfSvma7eufbb9Gflg9DNsOY1JS5MpDj6Hg51u1wdiQYpwJUv79KmDu7dqtGQleSlsQS8F0pSANIugMmqDg",
      "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..c2M8BRhtuQ3hAzuw2Ck3ng0rPAQK6-Vjx9tldHHBuzjGlGIVDZF3mz8stHgF5BB8ozT1lMkPUuDt7kJoBMsnDQ",
      "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..4x9cp01nPBdjuYShKgwrchWraETORU1ejxRN1j-_ClUI9zJ_151EickU5faGnlUJLh8MxP5_AD4Zu1mapqloCQ",
      "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..rSWBYRySybNRuAxBROwZKdl4xE8uVvZF828ga9Et2iAxPo4e5qZAb7dCfEAnI9otm1bm5_fFIsK46tg0cWfeBg"
    ]
  }
}
```

##### Presentation
```json
{
  "@context": [
    "https://www.w3.org/2018/credentials/v1",
    "https://www.txdmv.gov/credentials/v1",
    "https://w3id.org/security/data-integrity/v1"
  ],
  "type": [
    "VerifiableCredential",
    "DriverLicenseCredential"
  ],
  "credentialSubject": {
    "driverLicense": {
      "type": "DriverLicense",
      "dateOfBirth": "01-01-1990",
      "issuingAuthority": "TX"
    }
  },
  "proof": {
    "type": "DataIntegrityProof",
    "created": "2023-06-04T22:35:08.444Z",
    "cryptosuite": "di-sd-urdna2015-jose-2042",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:web:txdmv.gov#urn:ietf:params:oauth:jwk-thumbprint:sha-256:MggqrOi2MEJR1qOeF8Q9gKRxUNB9vrjbwqogJ1Er8k8",
    "keys": [
      {
        "kid": "#disclosure",
        "kty": "OKP",
        "crv": "Ed25519",
        "alg": "EdDSA",
        "x": "LJ3Hg9AxvtBvbaJbFdQVPqC0cNN16BAW2gI7x3j3ONI",
        "claimset_formats_supported": [
          "w3cvc-jsonld"
        ],
        "claimset_claims_supported": [
          "/credentialSubject/driverLicense/issuingAuthority"
        ]
      },
      {
        "kid": "#hmac",
        "kty": "oct",
        "alg": "HS256",
        "use": "sig",
        "key_ops": [
          "sign"
        ],
        "k": "6ecVU3RkxsgqsrwnokiaJKrzKpSJ_7ZQM_-VzOWVJN8"
      },
      {
        "kid": "#mandatory",
        "kty": "oct",
        "k": "R6PqMcxibm3QUtwoPSMXKbQo54d_vgyLaupafIYTUdI"
      },
      {
        "kid": "#proof",
        "kty": "oct",
        "k": "N3ZIo4DTV7KVVThNNMceBE9eQKWpoKkCBXdyseM2_ok"
      }
    ],
    "signature": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..cx9pLJE11YOgZCKbkxDA37tNXOZUK2ddvVzEwMo9ww9RVuRkFtk3Iw8nXA_3VOz_QMQjPXVtHWPa5lSIejczCQ",
    "signatures": [
      "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..kt_z9lA_4SmmtFitSrE1VZCJovN_UF1K2o-s21DBuYfXt_Yd7ZMcgPIa2I9Ef4gaYF3nem0bp3C7PwOaARKkAw"
    ],
    "labels": {
      "c14n0": "u0LXGNvz6K7ezRK0D105WQCp-5UKGdqIgpAzGCXahseQ",
      "c14n1": "u1cqsvx7nAFbUfv1JGsYaYwL22Y4rwB6X-_pQm-OyZ6s",
      "c14n2": "u0TAxbGB5FQuFU7oA-kaosQWkkozClvWj4oNZNaA0p50"
    },
    "mandatoryIndexes": [
      "0",
      "1",
      "3",
      "4",
      "5",
      "6"
    ]
  }
}
```

##### Verification
```json
{
  "verified": true,
  "document": {
    "@context": [
      "https://www.w3.org/2018/credentials/v1",
      "https://www.txdmv.gov/credentials/v1",
      "https://w3id.org/security/data-integrity/v1"
    ],
    "type": [
      "VerifiableCredential",
      "DriverLicenseCredential"
    ],
    "credentialSubject": {
      "driverLicense": {
        "type": "DriverLicense",
        "dateOfBirth": "01-01-1990",
        "issuingAuthority": "TX"
      }
    }
  }
}
```

</details>


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
  "id": "did:jwk:eyJrdHkiOiJFQyIsImNydiI6IlAtMjU2IiwiYWxnIjoiRVMyNTYiLCJ4IjoieUJiNUFYczlwbXFkaWpWNHZYQkdvSUQ0LWZzaDdoTjFOOVZKOHBmQ0RwQSIsInkiOiJWLWZqQWlDSDNLRU9wdEtFNHNzQVdZcVAxa0ZJR1B6aUpURWQzblNsWk00In0#0",
  "type": "JsonWebKey",
  "controller": "did:jwk:eyJrdHkiOiJFQyIsImNydiI6IlAtMjU2IiwiYWxnIjoiRVMyNTYiLCJ4IjoieUJiNUFYczlwbXFkaWpWNHZYQkdvSUQ0LWZzaDdoTjFOOVZKOHBmQ0RwQSIsInkiOiJWLWZqQWlDSDNLRU9wdEtFNHNzQVdZcVAxa0ZJR1B6aUpURWQzblNsWk00In0",
  "publicKeyJwk": {
    "kty": "EC",
    "crv": "P-256",
    "alg": "ES256",
    "x": "yBb5AXs9pmqdijV4vXBGoID4-fsh7hN1N9VJ8pfCDpA",
    "y": "V-fjAiCH3KEOptKE4ssAWYqP1kFIGPziJTEd3nSlZM4"
  },
  "privateKeyJwk": {
    "kty": "EC",
    "crv": "P-256",
    "alg": "ES256",
    "x": "yBb5AXs9pmqdijV4vXBGoID4-fsh7hN1N9VJ8pfCDpA",
    "y": "V-fjAiCH3KEOptKE4ssAWYqP1kFIGPziJTEd3nSlZM4",
    "d": "_9spbvffN7DUq6nc3wxKsuIwXuRkPNXFra5lF24SYQA"
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
  "type": ["VerifiableCredential", "DriverLicenseCredential"],
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
    "created": "2023-06-04T22:17:41.905Z",
    "cryptosuite": "di-sd-urdna2015-jose-2042",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:web:txdmv.gov#urn:ietf:params:oauth:jwk-thumbprint:sha-256:SCrCWothLkFvBvEkcRmEI2BgdI3D5QO3YAnXJlvIOnM",
    "keys": [
      {
        "kid": "#disclosure",
        "kty": "EC",
        "crv": "P-256",
        "alg": "ES256",
        "x": "xfiasHhMWaFp_HkkF5yvYaWiucvO8QC2r5JqR1Lx4gw",
        "y": "RSa0jGRhhrcQkPjpvgAk_8FQRB7Q0vOXqPYdNQH0mW8",
        "claimset_formats_supported": ["w3cvc-jsonld"],
        "claimset_claims_supported": [
          "/credentialSubject/driverLicense/issuingAuthority"
        ]
      },
      {
        "kid": "#hmac",
        "kty": "oct",
        "alg": "HS256",
        "use": "sig",
        "key_ops": ["sign"],
        "k": "c-sD1syEg3w0Y6LTW5nZt81NO-cW2j9Gnx5YreSU7-M"
      },
      {
        "kid": "#mandatory",
        "kty": "oct",
        "k": "619hjMgXqTn053QJRChlJHEcEKgeLEgro68QdL-kOA8"
      },
      {
        "kid": "#proof",
        "kty": "oct",
        "k": "JzjihLYjbnsn9TL5Vtdi6ihTrKPHD-itIuzLwzB1oYI"
      }
    ],
    "signature": "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..Xm3cwz5sRnxJHz_Jv13QGjonooBcMe2Mp2OQsWPo7E8avsWa7v6YU4Euu9oaPnftshnotsjM-w7oLLhBAD5dqA",
    "signatures": [
      "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..acShZ0HmT2Acf3MTae-F9uIVbFYPgUZrRqT6BUmfxwmu5IIOia_PiULDS7zopRztZ5GCIXOn22uZ82aC8jsGpg",
      "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..qAj46ro992Mrm79JXCuVEfPAhc7Tkzn5qGB5ux-uW6HgBq_M_0eQfAdcRQkFaueoWolLiFTuCOmRWGxs56E9Fw",
      "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..19rS_z_HwOXCM_Mg9d3n3Jh4IP2PvlL__KEqsXTrDwP_RkfcD-TbCVGlflkxgLjNbrHLa11_VRmjQS0gvTiaTQ",
      "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..RjLOT-gXBTWaQI0OhqZWCJ6zkycLiiwthVkeMtKUXLXLUtJl35I8-hDVAlOS41LAASqA71VswtCWUfr02TJbmA",
      "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..2jH5PR8w5tpJ629YpvJXcovFusuCfCJdZUhBgARnP7iSVIQ3FzrjdN0Yi7RoRd26sbCiXukMrD6zHuf2YeaQUg"
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
  "type": ["VerifiableCredential", "DriverLicenseCredential"],
  "credentialSubject": {
    "driverLicense": {
      "type": "DriverLicense",
      "dateOfBirth": "01-01-1990",
      "issuingAuthority": "TX"
    }
  },
  "proof": {
    "type": "DataIntegrityProof",
    "created": "2023-06-04T22:17:41.905Z",
    "cryptosuite": "di-sd-urdna2015-jose-2042",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:web:txdmv.gov#urn:ietf:params:oauth:jwk-thumbprint:sha-256:SCrCWothLkFvBvEkcRmEI2BgdI3D5QO3YAnXJlvIOnM",
    "keys": [
      {
        "kid": "#disclosure",
        "kty": "EC",
        "crv": "P-256",
        "alg": "ES256",
        "x": "xfiasHhMWaFp_HkkF5yvYaWiucvO8QC2r5JqR1Lx4gw",
        "y": "RSa0jGRhhrcQkPjpvgAk_8FQRB7Q0vOXqPYdNQH0mW8",
        "claimset_formats_supported": ["w3cvc-jsonld"],
        "claimset_claims_supported": [
          "/credentialSubject/driverLicense/issuingAuthority"
        ]
      },
      {
        "kid": "#hmac",
        "kty": "oct",
        "alg": "HS256",
        "use": "sig",
        "key_ops": ["sign"],
        "k": "c-sD1syEg3w0Y6LTW5nZt81NO-cW2j9Gnx5YreSU7-M"
      },
      {
        "kid": "#mandatory",
        "kty": "oct",
        "k": "619hjMgXqTn053QJRChlJHEcEKgeLEgro68QdL-kOA8"
      },
      {
        "kid": "#proof",
        "kty": "oct",
        "k": "JzjihLYjbnsn9TL5Vtdi6ihTrKPHD-itIuzLwzB1oYI"
      }
    ],
    "signature": "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..Xm3cwz5sRnxJHz_Jv13QGjonooBcMe2Mp2OQsWPo7E8avsWa7v6YU4Euu9oaPnftshnotsjM-w7oLLhBAD5dqA",
    "signatures": [
      "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..acShZ0HmT2Acf3MTae-F9uIVbFYPgUZrRqT6BUmfxwmu5IIOia_PiULDS7zopRztZ5GCIXOn22uZ82aC8jsGpg"
    ],
    "labels": {
      "c14n0": "u29_5a9DRDyJZc3eR3MiPGzyxuq1_x9Cn5RdjprGXmFI",
      "c14n1": "uQQ50on3Vc-Wnuvph5Sste5M2Px50AAOXEIZT-Db_UvE",
      "c14n2": "uG5qT2JfLuJO6iJvM853yccff4yrC3Buyvzvk0zczv_M"
    },
    "mandatoryIndexes": ["0", "1", "3", "4", "5", "6"]
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
    "type": ["VerifiableCredential", "DriverLicenseCredential"],
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
  "id": "did:jwk:eyJrdHkiOiJFQyIsImNydiI6IlAtMjU2IiwiYWxnIjoiRVMyNTYiLCJ4IjoiTmlwYlBVM1hqZzMyME41WVRMcnhJbGZIMjV2Y3BEWVZiUVE2amd4NnNxdyIsInkiOiJ1SnhwYk4xM1lJR184dXpwaXE4eVVDNXA0VElXNHU4MUJva0FtZ1dLM2dZIn0#0",
  "type": "JsonWebKey",
  "controller": "did:jwk:eyJrdHkiOiJFQyIsImNydiI6IlAtMjU2IiwiYWxnIjoiRVMyNTYiLCJ4IjoiTmlwYlBVM1hqZzMyME41WVRMcnhJbGZIMjV2Y3BEWVZiUVE2amd4NnNxdyIsInkiOiJ1SnhwYk4xM1lJR184dXpwaXE4eVVDNXA0VElXNHU4MUJva0FtZ1dLM2dZIn0",
  "publicKeyJwk": {
    "kty": "EC",
    "crv": "P-256",
    "alg": "ES256",
    "x": "NipbPU3Xjg320N5YTLrxIlfH25vcpDYVbQQ6jgx6sqw",
    "y": "uJxpbN13YIG_8uzpiq8yUC5p4TIW4u81BokAmgWK3gY"
  },
  "privateKeyJwk": {
    "kty": "EC",
    "crv": "P-256",
    "alg": "ES256",
    "x": "NipbPU3Xjg320N5YTLrxIlfH25vcpDYVbQQ6jgx6sqw",
    "y": "uJxpbN13YIG_8uzpiq8yUC5p4TIW4u81BokAmgWK3gY",
    "d": "RTBirq-mVgovvucwSmpmiELUBWfrx0rLwPxQcai9zfI"
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
    "created": "2023-06-04T22:30:30.158Z",
    "cryptosuite": "di-sd-urdna2015-jose-2042",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:web:txdmv.gov#urn:ietf:params:oauth:jwk-thumbprint:sha-256:bihRI4PZ9RzxD5qA3R5zcmcVEuLopLkTBBrROL82vr4",
    "keys": [
      {
        "kid": "#disclosure",
        "kty": "EC",
        "crv": "P-256",
        "alg": "ES256",
        "x": "dH0Vl6wCebLS4LOxSFlpwEO5g3_6pqsbrDQGCYyCTL8",
        "y": "2kShdqbr3ym9UzNkj2U_G1Rj4aeLnmuuivNCwHAJiek",
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
        "k": "dNx_AFoj-3scquubHF2-ahAsAg5tNuUtbQ2bLXhDt34"
      },
      {
        "kid": "#mandatory",
        "kty": "oct",
        "k": "oXXfibKRKb5lZlyXlTobcHUD3EBlaTdv6kwQt4mO-LA"
      },
      {
        "kid": "#proof",
        "kty": "oct",
        "k": "1dYD9valx00dQr9IuXB41ZixyB5XDeD9MTe4Of6NdnQ"
      }
    ],
    "signature": "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..f-cA-eXmdaSZdNIgSCcJ-QvAHtOdixUZ6uDDgQjU6KCFbTKAo5T_k2xEei3YGO-XdnpvRxQdepPF8-1jbDZoZw",
    "signatures": [
      "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..m50yLHNXT9KgN5OnnJvS6sxHpVHxUeaforn8VvOkW-iA5dxNb29q2XJ0JVS73Y98SuA8C2eYbdbQBVbC-uOJ5A",
      "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..Chsn_D05qbgOIMR3KqEvHKIHZ2QQSfPDqBI0rSyosrXoIFF8SfBBVowoDeKpMqCZjNmh4SSB0x7z8mdhkHL-Iw",
      "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..ce0V4tol1bPI1gXO95qL7Ydr-v9ItuEU0poJCj8yShb3pHMYVBHSF62rhI5AjuGmMF2cgSwaGnvtlO9NjXyzaA",
      "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..FG45LECpwkDgBbYd8K_PxLnwyYZBgIt8VubODvznw-dpn4HrTZrRNsD5mD93nQwsC3RLPIEPQd5u6KGW_EvViQ",
      "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19.._U7MhAlvHMN8XvnQ4XL9cHbVzgJw9CGZMCeNpJRVzLjaz9pQXyZJyPrBilHhH5i0-fmzaqxJ2f5zZSyoVTGqeA"
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
    "created": "2023-06-04T22:30:30.158Z",
    "cryptosuite": "di-sd-urdna2015-jose-2042",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:web:txdmv.gov#urn:ietf:params:oauth:jwk-thumbprint:sha-256:bihRI4PZ9RzxD5qA3R5zcmcVEuLopLkTBBrROL82vr4",
    "keys": [
      {
        "kid": "#disclosure",
        "kty": "EC",
        "crv": "P-256",
        "alg": "ES256",
        "x": "dH0Vl6wCebLS4LOxSFlpwEO5g3_6pqsbrDQGCYyCTL8",
        "y": "2kShdqbr3ym9UzNkj2U_G1Rj4aeLnmuuivNCwHAJiek",
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
        "k": "dNx_AFoj-3scquubHF2-ahAsAg5tNuUtbQ2bLXhDt34"
      },
      {
        "kid": "#mandatory",
        "kty": "oct",
        "k": "oXXfibKRKb5lZlyXlTobcHUD3EBlaTdv6kwQt4mO-LA"
      },
      {
        "kid": "#proof",
        "kty": "oct",
        "k": "1dYD9valx00dQr9IuXB41ZixyB5XDeD9MTe4Of6NdnQ"
      }
    ],
    "signature": "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..f-cA-eXmdaSZdNIgSCcJ-QvAHtOdixUZ6uDDgQjU6KCFbTKAo5T_k2xEei3YGO-XdnpvRxQdepPF8-1jbDZoZw",
    "signatures": [
      "eyJhbGciOiJFUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..m50yLHNXT9KgN5OnnJvS6sxHpVHxUeaforn8VvOkW-iA5dxNb29q2XJ0JVS73Y98SuA8C2eYbdbQBVbC-uOJ5A"
    ],
    "labels": {
      "c14n0": "uI4ixJ5_tNfouaM5r5v-0lQ_A7UO1FRnX1rDaHnz-_xE",
      "c14n1": "uAAuhXleFJPvBkom9etB8hmJ5PQkaLvCnJ_Ke1MWU1NI",
      "c14n2": "u47eHX_fCrrY75gU6r0GmuH8v4OY1v36v9bfjzEnbOUc"
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
<summary>ES384</summary>

##### Controller
```json
{
  "id": "did:jwk:eyJrdHkiOiJFQyIsImNydiI6IlAtMzg0IiwiYWxnIjoiRVMzODQiLCJ4IjoiODBjUXUtVWRWUklqRTBETHlqMGUwMUViMDVyRExTRTdrLXJ6MUFMVlZxcHJobHdyLVJfdmZ1RkphdlNjNUQ4NCIsInkiOiJzLUNGQWx3VzZjZm4wdDRrengwc1dSR3NZUDZhNXM1S3FLVXBBczZnNEthUG85NUJITzFEYlRtd3dtcDdiTFdGIn0#0",
  "type": "JsonWebKey",
  "controller": "did:jwk:eyJrdHkiOiJFQyIsImNydiI6IlAtMzg0IiwiYWxnIjoiRVMzODQiLCJ4IjoiODBjUXUtVWRWUklqRTBETHlqMGUwMUViMDVyRExTRTdrLXJ6MUFMVlZxcHJobHdyLVJfdmZ1RkphdlNjNUQ4NCIsInkiOiJzLUNGQWx3VzZjZm4wdDRrengwc1dSR3NZUDZhNXM1S3FLVXBBczZnNEthUG85NUJITzFEYlRtd3dtcDdiTFdGIn0",
  "publicKeyJwk": {
    "kty": "EC",
    "crv": "P-384",
    "alg": "ES384",
    "x": "80cQu-UdVRIjE0DLyj0e01Eb05rDLSE7k-rz1ALVVqprhlwr-R_vfuFJavSc5D84",
    "y": "s-CFAlwW6cfn0t4kzx0sWRGsYP6a5s5KqKUpAs6g4KaPo95BHO1DbTmwwmp7bLWF"
  },
  "privateKeyJwk": {
    "kty": "EC",
    "crv": "P-384",
    "alg": "ES384",
    "x": "80cQu-UdVRIjE0DLyj0e01Eb05rDLSE7k-rz1ALVVqprhlwr-R_vfuFJavSc5D84",
    "y": "s-CFAlwW6cfn0t4kzx0sWRGsYP6a5s5KqKUpAs6g4KaPo95BHO1DbTmwwmp7bLWF",
    "d": "tMSN9ptc_5iX5amZU3gIsRTmyYCvDQbRyvSjbq4WDH1o5KGIrR5DERKuZ4_BKWSv"
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
    "created": "2023-06-04T22:30:30.158Z",
    "cryptosuite": "di-sd-urdna2015-jose-2042",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:web:txdmv.gov#urn:ietf:params:oauth:jwk-thumbprint:sha-256:bihRI4PZ9RzxD5qA3R5zcmcVEuLopLkTBBrROL82vr4",
    "keys": [
      {
        "kid": "#disclosure",
        "kty": "EC",
        "crv": "P-384",
        "alg": "ES384",
        "x": "WzaIy-vRmy8-Mqjpq8RLsoO_xZPjcRtqF-S7_bXYQcQ6fYVkrDtAHkWwv2DVMyJx",
        "y": "oY9-BMk0BL2PAVDFX3Mx8BiRFEW_q-U_qe-yYzDxuXu_7TU-q8Usti8mPx4tYTMx",
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
        "k": "d0GjdXqGlSWtBCUAdyWQJ4meZEDNFQO0OVCiddn67yY"
      },
      {
        "kid": "#mandatory",
        "kty": "oct",
        "k": "4tFivTCjZoddEBCL6Wt6cUHQ_VQgiSQPHgpj0j0W3tU"
      },
      {
        "kid": "#proof",
        "kty": "oct",
        "k": "1dYD9valx00dQr9IuXB41ZixyB5XDeD9MTe4Of6NdnQ"
      }
    ],
    "signature": "eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..HC_ZcFiIqqTsdQRIzdbrVz3k8eoeFvDZXH26TbbN4OcocO78pc2z1uwBYs1G7tqR7GeMgzuQKhAjvXyQi7vxtreBJw_r-OF4JyFaAR2Y9-eLYxPVmDRTq6QaeJCMNXpt",
    "signatures": [
      "eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..WaynemqnhbjQlCRtnjdChH5Ff1Fqk7r0fEsnroClofpbt7_3sWjohsOYD_Yozi7jifT1jm3C_pquwofemaAsEQZruZ_vXGGIz53NO9QJO-5Ev_J-0M2ZnvT_t9M6lJeW",
      "eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..u6AK1IhNbCM1zEW50FP7J1StwLjr55n2YjbJMeQZMW41FjAASEV75-Sl6aJpX8mpQlNFL3Sjp5EP30xbrGLIolrvDQsd5Z6-yVFIu3Zr-ZN4-k5cOTaE4NvpWsFKA73y",
      "eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..IZ72t62Vd3NVUGremIH0-7_DHqBVR2nzQ8Clwfgb6XfGM-C7Wy8HuN05xdgAad76sTF4cSbaYItqY10kZJxVF7yO-UnGSEIQOHcjuwTnhvy2V7M_BmQ8mHgqrsOysM3l",
      "eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..WTsrSxNQ0Zt4m5CSRnYLvcGX9iVkbWQKrLYFaCGYL-B8rXgH-Cb1wnotjMDcUqp7WFtNRan4tFlCIt7BLdBf6-iMri8yZADVUnYgNZj5ZhBCmGjM_juqaHWvk8C3ZVk5",
      "eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..b5Prsw_PpxPaSDiTezSZkPd9xFYZiep7HvOW9PYQsCjx8_hhg9Zyj_1Jvbx-pDsdljk44F6x1Irsv8j_A1Up6fDX6M2SwOnbW3oTtlN9-WDti7tLxCnCBQqqT90dsLZ1"
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
    "created": "2023-06-04T22:30:30.158Z",
    "cryptosuite": "di-sd-urdna2015-jose-2042",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:web:txdmv.gov#urn:ietf:params:oauth:jwk-thumbprint:sha-256:bihRI4PZ9RzxD5qA3R5zcmcVEuLopLkTBBrROL82vr4",
    "keys": [
      {
        "kid": "#disclosure",
        "kty": "EC",
        "crv": "P-384",
        "alg": "ES384",
        "x": "WzaIy-vRmy8-Mqjpq8RLsoO_xZPjcRtqF-S7_bXYQcQ6fYVkrDtAHkWwv2DVMyJx",
        "y": "oY9-BMk0BL2PAVDFX3Mx8BiRFEW_q-U_qe-yYzDxuXu_7TU-q8Usti8mPx4tYTMx",
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
        "k": "d0GjdXqGlSWtBCUAdyWQJ4meZEDNFQO0OVCiddn67yY"
      },
      {
        "kid": "#mandatory",
        "kty": "oct",
        "k": "4tFivTCjZoddEBCL6Wt6cUHQ_VQgiSQPHgpj0j0W3tU"
      },
      {
        "kid": "#proof",
        "kty": "oct",
        "k": "1dYD9valx00dQr9IuXB41ZixyB5XDeD9MTe4Of6NdnQ"
      }
    ],
    "signature": "eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..HC_ZcFiIqqTsdQRIzdbrVz3k8eoeFvDZXH26TbbN4OcocO78pc2z1uwBYs1G7tqR7GeMgzuQKhAjvXyQi7vxtreBJw_r-OF4JyFaAR2Y9-eLYxPVmDRTq6QaeJCMNXpt",
    "signatures": [
      "eyJhbGciOiJFUzM4NCIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..IZ72t62Vd3NVUGremIH0-7_DHqBVR2nzQ8Clwfgb6XfGM-C7Wy8HuN05xdgAad76sTF4cSbaYItqY10kZJxVF7yO-UnGSEIQOHcjuwTnhvy2V7M_BmQ8mHgqrsOysM3l"
    ],
    "labels": {
      "c14n0": "uHS9LGgxx-SlW_q8QXa-fBI4p7T7YLMNleAoLkw5eR_o",
      "c14n1": "uKNIUql47qsb4A0m9Je-uUx9naLlYY_Dy6XYtswDrxh4",
      "c14n2": "uzgu_x7II7zsEJQVgSjkcwdm2iO5IU_u3FkNCp7yarxc"
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
<summary>RS256</summary>

##### Controller
```json
{
  "id": "did:jwk:eyJrdHkiOiJSU0EiLCJhbGciOiJSUzI1NiIsIm4iOiJwZ2VURm5scHNsbGVkYVAxNFRBeU5ucGF0Ql80Vkh4MUpsbnM5cjVNZ3dKYjVOQmRmNDZnVjJyVWtYblUwS2ZPMzZWbWNORlM2aEFRU0tiejZkYlAyU1luRzlYdm1kdkF1Zkg2NDJYY0xEMWo5UlphTGNOOGtZQUxZZWpYc0l6Ri1yZFNMMFRYQmM5ZzJXSWN4bmVKQTBCdXpTUzhPSDJXZ3FVMjRVV3JTNEpzWVl3Y2NWN2ZROG1leTVSay04cGRUTDFsWWY1UTduOGdvaDYycUVvbGdPMHM4OXBsSlpTUXZQWG9zUXBaakJ1bDJGOUY2NXZ6ZzJrV3hYNktVU3R6WFBwN045Tnd1QzlSeXNWSmlIN2lFTTdYMEd3QXdaSm5iTU5YZ25XYldaYlFNMi1Jb2JVMEhGbGNBdnBoOTJBVlNScjVsdWhhZWtwdEVnRU5fUUNYOHciLCJlIjoiQVFBQiJ9#0",
  "type": "JsonWebKey",
  "controller": "did:jwk:eyJrdHkiOiJSU0EiLCJhbGciOiJSUzI1NiIsIm4iOiJwZ2VURm5scHNsbGVkYVAxNFRBeU5ucGF0Ql80Vkh4MUpsbnM5cjVNZ3dKYjVOQmRmNDZnVjJyVWtYblUwS2ZPMzZWbWNORlM2aEFRU0tiejZkYlAyU1luRzlYdm1kdkF1Zkg2NDJYY0xEMWo5UlphTGNOOGtZQUxZZWpYc0l6Ri1yZFNMMFRYQmM5ZzJXSWN4bmVKQTBCdXpTUzhPSDJXZ3FVMjRVV3JTNEpzWVl3Y2NWN2ZROG1leTVSay04cGRUTDFsWWY1UTduOGdvaDYycUVvbGdPMHM4OXBsSlpTUXZQWG9zUXBaakJ1bDJGOUY2NXZ6ZzJrV3hYNktVU3R6WFBwN045Tnd1QzlSeXNWSmlIN2lFTTdYMEd3QXdaSm5iTU5YZ25XYldaYlFNMi1Jb2JVMEhGbGNBdnBoOTJBVlNScjVsdWhhZWtwdEVnRU5fUUNYOHciLCJlIjoiQVFBQiJ9",
  "publicKeyJwk": {
    "kty": "RSA",
    "alg": "RS256",
    "n": "pgeTFnlpslledaP14TAyNnpatB_4VHx1Jlns9r5MgwJb5NBdf46gV2rUkXnU0KfO36VmcNFS6hAQSKbz6dbP2SYnG9XvmdvAufH642XcLD1j9RZaLcN8kYALYejXsIzF-rdSL0TXBc9g2WIcxneJA0BuzSS8OH2WgqU24UWrS4JsYYwccV7fQ8mey5Rk-8pdTL1lYf5Q7n8goh62qEolgO0s89plJZSQvPXosQpZjBul2F9F65vzg2kWxX6KUStzXPp7N9NwuC9RysVJiH7iEM7X0GwAwZJnbMNXgnWbWZbQM2-IobU0HFlcAvph92AVSRr5luhaekptEgEN_QCX8w",
    "e": "AQAB"
  },
  "privateKeyJwk": {
    "kty": "RSA",
    "alg": "RS256",
    "d": "Koe-Mf-gB8PE4rXBgpHqCvKE0adu4ZWQHObkQMC2sMil6ZNGoCpVAI-pLCrdTSXvZHLmLvgwGS1MPpAl4zzXuXSAiCzhV7RnRjqqXh31rI99T4cOSrLM8iiuwcH3no4xGOxk7R7hRee9k3IClQSB4Idc2sgSPxZMu-K-kC5cltbDytsJDdSGnKm5rCElspjGp9txfH1gj_dM6E0GbEyFTKgBXH-QCpQbOQeY-HckI7JQZqgE9ENjPSQysVMlz1SDWQDbPYihpBq_9G5hXkHq8OMr9nzzon_7puD1gUNktrGZWZwOkldjrtlt77akppBDwybkUHTIzgVxs1Vg3tqooQ",
    "n": "pgeTFnlpslledaP14TAyNnpatB_4VHx1Jlns9r5MgwJb5NBdf46gV2rUkXnU0KfO36VmcNFS6hAQSKbz6dbP2SYnG9XvmdvAufH642XcLD1j9RZaLcN8kYALYejXsIzF-rdSL0TXBc9g2WIcxneJA0BuzSS8OH2WgqU24UWrS4JsYYwccV7fQ8mey5Rk-8pdTL1lYf5Q7n8goh62qEolgO0s89plJZSQvPXosQpZjBul2F9F65vzg2kWxX6KUStzXPp7N9NwuC9RysVJiH7iEM7X0GwAwZJnbMNXgnWbWZbQM2-IobU0HFlcAvph92AVSRr5luhaekptEgEN_QCX8w",
    "e": "AQAB",
    "p": "uEx9-2im0p7peql9O-ghz6UBwbVQps7YMXP9Z24Ibf3UcYVgfwRZEM6j-o0oilOkqljTP27R59N4aIqvxb-_9F3aFG_Bfh8hzRMuzXKFdEffwfOuJpOEqLVcYAljj3KvQEFyCMxZGH5FjsGg8worloCwjt1i0DzFjPjyqFhebF0",
    "q": "5p-Iq9j--x69hVUZ4J4U3PC2jmNRTPZcI9NmULt2VPxWL3Argsu2vr1MGukE7xQDRYhS8GcRyNPgF5uE6jnLV0Pdqw9_keh2rK6V-CRRu5KtIsSiXyjQWanaD2kTa1QsjEwuiY5kQB6zaovgp-DesxC3ZuRS9INydXcQppmpUI8",
    "dp": "O5ENjvqOILkYAXtSbNBkTTap0LAHt0JXgfRZTNq1gsdtqJtRSvxexR3kxhBlr__E0wIOlQv-cA1bd36LvUByjErhN4W_ZkItrJisod6H38NzQL6_5Nv9HoIvryKZuT16Ayyj7NAPY-k8Fh3jJWp-GBDT__jx_RgHSb8UvvCA5Ek",
    "dq": "fu0Mhi_eXY0Ul1436MR4DQU6I_GLXEU2fs0pQYN649khAejFOa4ufJmoWiMnAQHNryYRJ5hCVHovmi6Qn2yBehyy0iOsfTwonG9VwIUUqpxWR41bI-5NhRuTFOoqsuZXwjtnXXONvzBmZFxpn1uGlZy8o5dEBKiXhQirlFV7twc",
    "qi": "SRRDSD38Nx2adDqp5dlkayq85RbNUoJKdugUE949QLsy8twguKHNszCaMVamNWvicfVm_2VGtWnRr6bvbkAOSLYkZRqbipJwsQomm3JLK6h1xs39KheaBHDVgVMeA3fsAyrJ2QJDwftAhpusTXMvLVC0nAGHQL-YYqMcdGD09g"
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
    "created": "2023-06-04T22:30:30.158Z",
    "cryptosuite": "di-sd-urdna2015-jose-2042",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:web:txdmv.gov#urn:ietf:params:oauth:jwk-thumbprint:sha-256:bihRI4PZ9RzxD5qA3R5zcmcVEuLopLkTBBrROL82vr4",
    "keys": [
      {
        "kid": "#disclosure",
        "kty": "RSA",
        "alg": "RS256",
        "n": "mBtufnwO-WEdvhLEm4g1IIG9YYaFnt61_BVduaUPk5Pc8r6epAgP7HcYbnUqGz63gA__Ls6uzIEk3NCPczRk_pZGpX8IOo52ACpskAipQ-HU3-VJpNe5l0vuZHoNpxuFODOtbOP-gk1g_wk7H5CD6uupz6qoMsjje2PZ9YF8Uq8zOQ43aTtl0MXKBHJJeJbRniOG_l3ITrwphyP3DNHFfxKaZJxyep6RXNhXODxCFUNU3V7gRzxr7x96BRIr9FERn2ROwjPXa3b_PYHWkm3wXtwUyGXskvdb1DR20Vvfnwi4fj9FLKU1WNfOrQxdRfS2xA8Xb_X5KsNLS6L3K3ybnw",
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
        "k": "mDkx5pxFVEl3GOp8pTFDO8nTgwYjdG9G-zl8CS-tk1g"
      },
      {
        "kid": "#mandatory",
        "kty": "oct",
        "k": "mEinjUL7-pUFqvErx6Z2uK6wpbWSRb8ddPVweqVQ1xg"
      },
      {
        "kid": "#proof",
        "kty": "oct",
        "k": "1dYD9valx00dQr9IuXB41ZixyB5XDeD9MTe4Of6NdnQ"
      }
    ],
    "signature": "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..pMfKPyOcrs1xLtL7bdIEdPQNHuZh4KK6DbtOBPK3GRJdihPEfFdznyf_qcjDE9VdH3NF0tdiXDxiISxFdCANMmgjuBKEuQIw9MsHi-fqcZ297bVs3pDSslq3ZCUehfdmnMyFR7P4fH8dF0LUV5cNz-jkPkGjthKXSze2VFkrzPoIeRmG2s0xgNl5htpJZzXn9V9u37iVn7PzhlqVqJgIraVorYq69mvrM9S6NnzdSfE8urUHZGPMm4ULqNeVepvMV6sH0AQiKd5u52X5lXbLOVBxYufN1zuCetqC_48Jym2MXLEa3A04Xad7eZq92HoKM8vNejGGlLTMk8byyk_4xw",
    "signatures": [
      "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..i74ZOyk399EGOQKd_WDU7hUCt6iruC1DxJ33GGEwDrIVKUBw8X70eqv4MGfNKVCIpm7C49QWhBqSPByxvvBC2cXJWomGAZdygrjzxCERoBlYL8yuaB38wmW5NlBEnHRjAKcLsr-8aiZg2DGjbR_e6B0Q0jfG9ct4U5lmZZEVvg8Xv_65QpokOuoEggWw1sY4333nsRgcUsziHkomuDmOuxf_yBMDzpy9VleyuIYT0vnYq21EFr0OzFdIx3aD28fWVhEMi5RbjVNPXurV17B3SXToJKqsIY1vjtj61YYq89Frmic0P--Wy4jgjas0FCTaFKVnpNI6lpZcuNkK-KTglQ",
      "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..XJOxBO5jjMOEBaBGIlqSI7hN3Z6IT8RP9n2dOl4YOJqJcLmOTsmzSp5g53UhyNmUlgwMXFlgus6pG-D35o0myTI0MzQp03w23WUzrtUi3OBiLS98MceVmQQ_tvc36txAz1zsOKpkAZ47ny2a-cTdqBU_AVJ7GPPXBqzSxuR83k7hseLwVFcUcrelDbWSWJomXpwHh1mv-_mS049o5W3xf7I1Vz70CkozdzPJl3uM04a_cEzxEBb5dHWE2Ibw_UPweQJlLdw5EkVKdtzo_KxGTJUZsWnYWLDD7Ch48a753mJ6LFPev76veKoPTXgxZB42Vxm_C0GaKpHYspLj6Wl_cg",
      "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..Dz1q78CfSa7UqCbz9CHefpYhfM1Ou_emV2L0S3O3A_TBbVtFK0t4Ojqz7vDa2q7P3gRjP1lFceaIQ7sMygvqfDYSOgM8J74TqXvLmBsVxjQEszbQtTCTkLK05qQnxS47H_Yzp72YZ1pXWghI1cuRNh-3GHo4Xdj-O_Xo_LkkUvmvuQmEl7ATJv3ByVeEwFkh2R_61ivIKaioudVEoufatlI-rQepMBcu0PT8HE3xgjHJcbwM1x8b9WHNsMljw7qmUPLgW34Vp5tRkkJqHcmm5zTbTlO__7m4y-7Zq792P2fEYb6TXZ9ntznYqJhHNn-isb_03Ii3hAhyvzPn_Ei5gA",
      "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..SufXMmwAKhaFikwaohD20OB4jr2iGRgfIj6kiEA7xB14dvTuNWcx_cnPLJybt9lHiKoOMkVOc7yt-e45JQYjZJOKLzTdhStx23ZTznmw5Hj-qRlyAXSlVxx8cXbZD2exBGE_MlQ652Ju2BCHTLo0cgC0IW-39IF-YbURMmYG5n6OXOrTmIBJlCK4ezGPo6mivs9X524p2eRDX3SLshgLZf83V35SNxoVBwgBw_5HEGLHMqyqTxXRag5WHfMb9XH0rSgaa4HhueFrEuoq74dBomLiUnXddUHAeGFe_HE2DY3X6Bq486dmHtXPKeuCwKxNDii7BVM2lqPuspCyLuEg3A",
      "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..RdjjGrhvTDezCm8koxUZq8IC0KE8jROe7_7aCK_2QURt6zevIqWgKQzwITdQbNkRIB-ffnr4FewkAkaqceV-DaEQAGdET8iS5zVoONJX6-KU52ABtftbboJ8c16vKjePFVmtd6tQKOfpKgcUm0F56xpxCDRBN98iYFXFDOf_geGXHzlnb7KLJLrEjKYJQv4LlADf31L8dt_iXWXl-5n7253wBOPknr-KHzAgajFaWFEZu3d7fnZHjSd7IIkQSGCY76-zrXfSnstUOS9arKaZ7TcYxosFtv33gYUy60Q5oUEb6e6_CjwHA4IoJb8aoUI8CRIkaJ84nxlkC7h7n3Y23w"
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
    "created": "2023-06-04T22:30:30.158Z",
    "cryptosuite": "di-sd-urdna2015-jose-2042",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:web:txdmv.gov#urn:ietf:params:oauth:jwk-thumbprint:sha-256:bihRI4PZ9RzxD5qA3R5zcmcVEuLopLkTBBrROL82vr4",
    "keys": [
      {
        "kid": "#disclosure",
        "kty": "RSA",
        "alg": "RS256",
        "n": "mBtufnwO-WEdvhLEm4g1IIG9YYaFnt61_BVduaUPk5Pc8r6epAgP7HcYbnUqGz63gA__Ls6uzIEk3NCPczRk_pZGpX8IOo52ACpskAipQ-HU3-VJpNe5l0vuZHoNpxuFODOtbOP-gk1g_wk7H5CD6uupz6qoMsjje2PZ9YF8Uq8zOQ43aTtl0MXKBHJJeJbRniOG_l3ITrwphyP3DNHFfxKaZJxyep6RXNhXODxCFUNU3V7gRzxr7x96BRIr9FERn2ROwjPXa3b_PYHWkm3wXtwUyGXskvdb1DR20Vvfnwi4fj9FLKU1WNfOrQxdRfS2xA8Xb_X5KsNLS6L3K3ybnw",
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
        "k": "mDkx5pxFVEl3GOp8pTFDO8nTgwYjdG9G-zl8CS-tk1g"
      },
      {
        "kid": "#mandatory",
        "kty": "oct",
        "k": "mEinjUL7-pUFqvErx6Z2uK6wpbWSRb8ddPVweqVQ1xg"
      },
      {
        "kid": "#proof",
        "kty": "oct",
        "k": "1dYD9valx00dQr9IuXB41ZixyB5XDeD9MTe4Of6NdnQ"
      }
    ],
    "signature": "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..pMfKPyOcrs1xLtL7bdIEdPQNHuZh4KK6DbtOBPK3GRJdihPEfFdznyf_qcjDE9VdH3NF0tdiXDxiISxFdCANMmgjuBKEuQIw9MsHi-fqcZ297bVs3pDSslq3ZCUehfdmnMyFR7P4fH8dF0LUV5cNz-jkPkGjthKXSze2VFkrzPoIeRmG2s0xgNl5htpJZzXn9V9u37iVn7PzhlqVqJgIraVorYq69mvrM9S6NnzdSfE8urUHZGPMm4ULqNeVepvMV6sH0AQiKd5u52X5lXbLOVBxYufN1zuCetqC_48Jym2MXLEa3A04Xad7eZq92HoKM8vNejGGlLTMk8byyk_4xw",
    "signatures": [
      "eyJhbGciOiJSUzI1NiIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..Dz1q78CfSa7UqCbz9CHefpYhfM1Ou_emV2L0S3O3A_TBbVtFK0t4Ojqz7vDa2q7P3gRjP1lFceaIQ7sMygvqfDYSOgM8J74TqXvLmBsVxjQEszbQtTCTkLK05qQnxS47H_Yzp72YZ1pXWghI1cuRNh-3GHo4Xdj-O_Xo_LkkUvmvuQmEl7ATJv3ByVeEwFkh2R_61ivIKaioudVEoufatlI-rQepMBcu0PT8HE3xgjHJcbwM1x8b9WHNsMljw7qmUPLgW34Vp5tRkkJqHcmm5zTbTlO__7m4y-7Zq792P2fEYb6TXZ9ntznYqJhHNn-isb_03Ii3hAhyvzPn_Ei5gA"
    ],
    "labels": {
      "c14n0": "uOPyS0dfuBBzps2qKaddMnXJ7pjE8pY9fOR-f79-Ogdk",
      "c14n1": "uD8xoGmjXtVDtBncKtqqPNlB5vD5RH7nPzzzBlqx2dFU",
      "c14n2": "uXhl0gAj0sddsZJ6d0-IHKaNWTFODrg6yqm5VV-UqK4Q"
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
  "id": "did:jwk:eyJrdHkiOiJFQyIsImNydiI6InNlY3AyNTZrMSIsImFsZyI6IkVTMjU2SyIsIngiOiIyZ0s3aDlLSnB6bXRhelBCSEhwV0gxRWhETDhaOGZmNDZnNE1xUTNkVmpJIiwieSI6IlN0X2J4VFVmM1R4bUU5M0UzZTJZVW10b2ZPTTNkclNpbHpGek1GdmR5cXcifQ#0",
  "type": "JsonWebKey",
  "controller": "did:jwk:eyJrdHkiOiJFQyIsImNydiI6InNlY3AyNTZrMSIsImFsZyI6IkVTMjU2SyIsIngiOiIyZ0s3aDlLSnB6bXRhelBCSEhwV0gxRWhETDhaOGZmNDZnNE1xUTNkVmpJIiwieSI6IlN0X2J4VFVmM1R4bUU5M0UzZTJZVW10b2ZPTTNkclNpbHpGek1GdmR5cXcifQ",
  "publicKeyJwk": {
    "kty": "EC",
    "crv": "secp256k1",
    "alg": "ES256K",
    "x": "2gK7h9KJpzmtazPBHHpWH1EhDL8Z8ff46g4MqQ3dVjI",
    "y": "St_bxTUf3TxmE93E3e2YUmtofOM3drSilzFzMFvdyqw"
  },
  "privateKeyJwk": {
    "kty": "EC",
    "crv": "secp256k1",
    "alg": "ES256K",
    "x": "2gK7h9KJpzmtazPBHHpWH1EhDL8Z8ff46g4MqQ3dVjI",
    "y": "St_bxTUf3TxmE93E3e2YUmtofOM3drSilzFzMFvdyqw",
    "d": "ar92yOQO6lW566EDKy_J_pUi6Cm6rCQnqWWWCPTap74"
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
    "created": "2023-06-04T22:30:30.158Z",
    "cryptosuite": "di-sd-urdna2015-jose-2042",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:web:txdmv.gov#urn:ietf:params:oauth:jwk-thumbprint:sha-256:bihRI4PZ9RzxD5qA3R5zcmcVEuLopLkTBBrROL82vr4",
    "keys": [
      {
        "kid": "#disclosure",
        "kty": "EC",
        "crv": "secp256k1",
        "alg": "ES256K",
        "x": "lSq2HlIK5iO_QszBHmH_22RHvJXg7yOaWnxI3ZNDRuU",
        "y": "fFRkopZVwusP4f4GpoeYUj1Cmzyl13IaJfek5RedNS8",
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
        "k": "b5ZOZwS44-NkIIWbp9e6Zlpof4Yb8dc5FdOxo0GSfaI"
      },
      {
        "kid": "#mandatory",
        "kty": "oct",
        "k": "HTS3_Nk8-lQlgqZ_LURH0ovhI0MsskQKe7h_4d-o6Hw"
      },
      {
        "kid": "#proof",
        "kty": "oct",
        "k": "1dYD9valx00dQr9IuXB41ZixyB5XDeD9MTe4Of6NdnQ"
      }
    ],
    "signature": "eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..5zjBhg4EUaQD3Zefa7-mvp-9zO9b3dmTK1Rcl4C183LDRN1Ugb-rT8RoDYYpAEnY44XPELpXs0p9Z7itD2dpLQ",
    "signatures": [
      "eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..-0NX7i12Rj19kuYP_Jy1QnERQsHGlTd353v_flgCWtsRg8vM34DgeLC-3JbkrvrHVZwO7LW9YvdnOSQ_y3RI8w",
      "eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..hrUeWjV1LknzI3YRPywWwqK5q-Ous0AxB8crC5TSety_CZMhUGfvPC85fU7jrq7fxlwZA4Mx_RqSqZ0pqxn7Uw",
      "eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..rh8MtU3uQ4BMxkhPGoM7puS2kX7aDOK3-wq38mhSPobi2hsjYiEhxsdxclI6b6HzVYqZgPwWIH0J2az1h3ft2A",
      "eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..WlAP9oOOBQ_rfpYeLeMCTqGS5CQ5LrXDWlxSZthRBwH1QgpXwqNsamhq27EtqJCP6TLX3FbJD6h6TTt4fzTD0g",
      "eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..pj93X6H7RMrjUEk5MOP9Lxe3Qq9k2r0Q9GKI2fUWRXUpp3iQcu45MpLUwPVOU80G12Y1OdeEXd0WTvonYZI9NA"
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
    "created": "2023-06-04T22:30:30.158Z",
    "cryptosuite": "di-sd-urdna2015-jose-2042",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:web:txdmv.gov#urn:ietf:params:oauth:jwk-thumbprint:sha-256:bihRI4PZ9RzxD5qA3R5zcmcVEuLopLkTBBrROL82vr4",
    "keys": [
      {
        "kid": "#disclosure",
        "kty": "EC",
        "crv": "secp256k1",
        "alg": "ES256K",
        "x": "lSq2HlIK5iO_QszBHmH_22RHvJXg7yOaWnxI3ZNDRuU",
        "y": "fFRkopZVwusP4f4GpoeYUj1Cmzyl13IaJfek5RedNS8",
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
        "k": "b5ZOZwS44-NkIIWbp9e6Zlpof4Yb8dc5FdOxo0GSfaI"
      },
      {
        "kid": "#mandatory",
        "kty": "oct",
        "k": "HTS3_Nk8-lQlgqZ_LURH0ovhI0MsskQKe7h_4d-o6Hw"
      },
      {
        "kid": "#proof",
        "kty": "oct",
        "k": "1dYD9valx00dQr9IuXB41ZixyB5XDeD9MTe4Of6NdnQ"
      }
    ],
    "signature": "eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..5zjBhg4EUaQD3Zefa7-mvp-9zO9b3dmTK1Rcl4C183LDRN1Ugb-rT8RoDYYpAEnY44XPELpXs0p9Z7itD2dpLQ",
    "signatures": [
      "eyJhbGciOiJFUzI1NksiLCJiNjQiOmZhbHNlLCJjcml0IjpbImI2NCJdfQ..-0NX7i12Rj19kuYP_Jy1QnERQsHGlTd353v_flgCWtsRg8vM34DgeLC-3JbkrvrHVZwO7LW9YvdnOSQ_y3RI8w"
    ],
    "labels": {
      "c14n0": "u7XJa2nY9OQpBAtyvUMnL1EeN0tqchlBpP4j9z7UHv_A",
      "c14n1": "udv7STKmt2WgAjemyEV6gvZArusFhR-OxiCedGRvxup0",
      "c14n2": "uJR5AUVJma-3PnoPyDs4p-mKmKJBc2F9fKlIW3Ev60cM"
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



<details>
<summary>EdDSA</summary>

##### Controller
```json
{
  "id": "did:jwk:eyJrdHkiOiJPS1AiLCJjcnYiOiJFZDI1NTE5IiwiYWxnIjoiRWREU0EiLCJ4IjoicEREY2MySXZqcVI4Mmo2X3BXUGxWbTk4Rndrd2pKeUFQWVlKR2NNdVlldyJ9#0",
  "type": "JsonWebKey",
  "controller": "did:jwk:eyJrdHkiOiJPS1AiLCJjcnYiOiJFZDI1NTE5IiwiYWxnIjoiRWREU0EiLCJ4IjoicEREY2MySXZqcVI4Mmo2X3BXUGxWbTk4Rndrd2pKeUFQWVlKR2NNdVlldyJ9",
  "publicKeyJwk": {
    "kty": "OKP",
    "crv": "Ed25519",
    "alg": "EdDSA",
    "x": "pDDcc2IvjqR82j6_pWPlVm98FwkwjJyAPYYJGcMuYew"
  },
  "privateKeyJwk": {
    "kty": "OKP",
    "crv": "Ed25519",
    "alg": "EdDSA",
    "x": "pDDcc2IvjqR82j6_pWPlVm98FwkwjJyAPYYJGcMuYew",
    "d": "Q_0aSerdY9LpvY-vej4z9V05M4VJEkOdoLujoUFizQ0"
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
    "created": "2023-06-04T22:30:30.158Z",
    "cryptosuite": "di-sd-urdna2015-jose-2042",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:web:txdmv.gov#urn:ietf:params:oauth:jwk-thumbprint:sha-256:bihRI4PZ9RzxD5qA3R5zcmcVEuLopLkTBBrROL82vr4",
    "keys": [
      {
        "kid": "#disclosure",
        "kty": "OKP",
        "crv": "Ed25519",
        "alg": "EdDSA",
        "x": "MuY0p483ssi6VUpJ0UGOLOSxX1WkE_niTNA_NxujJM0",
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
        "k": "Wov8MHAMTOe19Sut5SW4WIhn4CiYHvt6UBLRUXphgwM"
      },
      {
        "kid": "#mandatory",
        "kty": "oct",
        "k": "PfdiDeKASoFqQZPRhOcIyOt29QEdGRuOKRYBZQ688FA"
      },
      {
        "kid": "#proof",
        "kty": "oct",
        "k": "1dYD9valx00dQr9IuXB41ZixyB5XDeD9MTe4Of6NdnQ"
      }
    ],
    "signature": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..i2uN5hg30piImDm4wBtbroKA_kb65hmvN0UkC011fMnfOaP8fwYwhbzkpx3WIyNeFjab5lVc6bhngDmv8Jr0CQ",
    "signatures": [
      "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..iTjVivx71jIyfvtxDuSfzsolPnE24yIt6sObkbLNpJ9Da05rbvFpam_SGmJg88AvvZvrVNCsZyC7Lt1l3v3vDA",
      "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..v7SzkV927X5gCHRITCBWFROcFk2bllzi3rRBWvkg4Xe6GcYcSen-mOL5uhAoW2l-lmds9VMu-y5n-nTSrug6Cw",
      "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..36tuhC6QLr62hPze-8Ybb5HuZDbt4hz49ufl4R2JEVaOgXKeQ12xTLy3gHB5TcrpGllHbUbu7VhyrHn4GVNcDw",
      "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..NK-_WVCVJrMVZXL9rDq7FmfcyPzhFZ14vwgYaN49DmKxNoXR5SiOxW9nMsWPKPMKYolO3A5V94YGxNVThEeoAA",
      "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..rn-UmsmkvaO6nI8coqrzHAQVbBCzRYVjLpyYc14DCZPHfhCvrse27tDNYFEhZlOPmwE3H6I6W7eEBUB7DGuvAQ"
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
    "created": "2023-06-04T22:30:30.158Z",
    "cryptosuite": "di-sd-urdna2015-jose-2042",
    "proofPurpose": "assertionMethod",
    "verificationMethod": "did:web:txdmv.gov#urn:ietf:params:oauth:jwk-thumbprint:sha-256:bihRI4PZ9RzxD5qA3R5zcmcVEuLopLkTBBrROL82vr4",
    "keys": [
      {
        "kid": "#disclosure",
        "kty": "OKP",
        "crv": "Ed25519",
        "alg": "EdDSA",
        "x": "MuY0p483ssi6VUpJ0UGOLOSxX1WkE_niTNA_NxujJM0",
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
        "k": "Wov8MHAMTOe19Sut5SW4WIhn4CiYHvt6UBLRUXphgwM"
      },
      {
        "kid": "#mandatory",
        "kty": "oct",
        "k": "PfdiDeKASoFqQZPRhOcIyOt29QEdGRuOKRYBZQ688FA"
      },
      {
        "kid": "#proof",
        "kty": "oct",
        "k": "1dYD9valx00dQr9IuXB41ZixyB5XDeD9MTe4Of6NdnQ"
      }
    ],
    "signature": "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..i2uN5hg30piImDm4wBtbroKA_kb65hmvN0UkC011fMnfOaP8fwYwhbzkpx3WIyNeFjab5lVc6bhngDmv8Jr0CQ",
    "signatures": [
      "eyJhbGciOiJFZERTQSIsImI2NCI6ZmFsc2UsImNyaXQiOlsiYjY0Il19..iTjVivx71jIyfvtxDuSfzsolPnE24yIt6sObkbLNpJ9Da05rbvFpam_SGmJg88AvvZvrVNCsZyC7Lt1l3v3vDA"
    ],
    "labels": {
      "c14n0": "uJ_EmFAOB748gyOMn3LnnT6BHALukXvoa3fJkzpjxNCQ",
      "c14n1": "uqanpf6f8qnyEF0nQdvR1K3R6Cf1sg0PsphxwgNmVKTs",
      "c14n2": "uFcK4vxnkZ1JDW5e8TPY4Xd2u4Gi2wd7yn0GyZBZXkY8"
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


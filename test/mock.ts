export const exampleControllerKeyPair = {
  id: '',
  type: 'JsonWebKey',
  controller: '',
  publicKeyJwk: {
    crv: 'Ed25519',
    kty: 'OKP',
    alg: 'EdDSA',
    x: 'lI_Z_oDr36eC1ag0xbtW86nwwU1kKs5notleolzw8Lw',
  },
  privateKeyJwk: {
    crv: 'Ed25519',
    kty: 'OKP',
    alg: 'EdDSA',
    x: 'lI_Z_oDr36eC1ag0xbtW86nwwU1kKs5notleolzw8Lw',
    d: 'qOEzjDFHRpRf8JumTNSIt7hUbWVJH0REa_jjJx65s64',
  },
}

export const exampleVerifiableCredential = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://www.txdmv.gov/credentials/v1',
    'https://w3id.org/security/data-integrity/v1',
  ],
  type: ['VerifiableCredential', 'DriverLicenseCredential'],
  issuer: 'did:web:txdmv.gov',
  issuanceDate: '2010-01-01T19:23:24Z',
  credentialSubject: {
    driverLicense: {
      type: 'DriverLicense',
      documentIdentifier: 'T21387yc328c7y32h23f23',
      dateOfBirth: '01-01-1990',
      expirationDate: '01-01-2030',
      issuingAuthority: 'TX',
    },
  },
}
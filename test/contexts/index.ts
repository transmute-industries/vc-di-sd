const contexts: Record<string, unknown> = {
  'https://www.w3.org/2018/credentials/v1': require('./credentials-v1.json'),
  'https://www.txdmv.gov/credentials/v1': require('./drivers-license-v1.json'),
  'https://w3id.org/security/data-integrity/v1': require('./data-integrity-v1.json'),
}

export default contexts

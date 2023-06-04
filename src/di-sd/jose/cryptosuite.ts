const canonicalization = 'urdna2015'
const digest = 'sha256'
const security = `jose`
const prefix = `di-sd-${canonicalization}-${security}`
const year = 2042
const name = `${prefix}-${year}`
const cryptosuite = { name, prefix, digest, canonicalization }
export default cryptosuite

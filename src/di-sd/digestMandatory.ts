import crypto from 'crypto'
import { RequestMandatoryDigest } from '../types'
const encoder = new TextEncoder()

async function digestMandatory({ algorithm, values }: RequestMandatoryDigest) {
  return new Uint8Array(
    crypto
      .createHash(algorithm)
      .update(encoder.encode(values.join('')))
      .digest(),
  )
}

export default digestMandatory

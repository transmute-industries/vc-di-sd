import * as jose from 'jose'

import {
  FlattendedDetachedJws,
  VerifyFlattenedDetachedJws,
  RestrictedPublicKeyJwk,
  RestrictedPrivateKeyJwk,
} from './types'

const detachedHeaderParams = { b64: false, crit: ['b64'] }

const generate = async (alg: string, extractable = true) => {
  const { publicKey, privateKey } = await jose.generateKeyPair(alg, {
    extractable,
  })
  const publicKeyJwk = (await jose.exportJWK(
    publicKey,
  )) as RestrictedPublicKeyJwk
  publicKeyJwk.alg = alg
  const privateKeyJwk = (await jose.exportJWK(
    privateKey,
  )) as RestrictedPrivateKeyJwk
  privateKeyJwk.alg = alg
  const controller = publicKeyToDid(publicKeyJwk)
  return {
    id: controller + '#0',
    type: 'JsonWebKey',
    controller: controller,
    publicKeyJwk: formatJwk(publicKeyJwk),
    privateKeyJwk: formatJwk(privateKeyJwk),
  }
}

// TODO Remote KMS.
const signer = async (privateKeyJwk: RestrictedPrivateKeyJwk) => {
  const { alg } = privateKeyJwk
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {d, ...publicKewJwk} = privateKeyJwk
  const privateKey = await jose.importJWK(privateKeyJwk)
  return {
    alg: alg,
    iss: publicKeyToDid(publicKewJwk),
    kid: `#0`,
    sign: async (bytes: Uint8Array) => {
      const jws = await new jose.FlattenedSign(bytes)
        .setProtectedHeader({ alg, ...detachedHeaderParams })
        .sign(privateKey)
      return `${jws.protected}..${jws.signature}`
    },
  }
}

// TODO Remote KMS.
const verifier = async (
  publicKeyJwk: RestrictedPublicKeyJwk,
): Promise<{ alg: string; verify: VerifyFlattenedDetachedJws }> => {
  const { alg } = publicKeyJwk
  const publicKey = await jose.importJWK(publicKeyJwk)
  return {
    alg: alg,
    verify: async (jws: FlattendedDetachedJws) => {
      const { protectedHeader, payload } = await jose.flattenedVerify(
        jws,
        publicKey,
      )
      return { protectedHeader, payload } as {
        protectedHeader: jose.JWSHeaderParameters
        payload: Uint8Array
      }
    },
  }
}

const formatJwk = (jwk: Record<string, string | object>) => {
  const {
    kid,
    x5u,
    x5c,
    x5t,
    kty,
    crv,
    alg,
    use,
    key_ops,
    x,
    y,
    d,
    ...rest
  } = structuredClone(jwk)
  return JSON.parse(
    JSON.stringify({
      kid,
      kty,
      crv,
      alg,
      use,
      key_ops,
      x,
      y,
      d,
      x5u,
      x5c,
      x5t,
      ...rest,
    }),
  )
}

const publicKeyToDid = (publicKeyJwk: RestrictedPublicKeyJwk) => {
  const id = `did:jwk:${jose.base64url.encode(
    JSON.stringify(formatJwk(publicKeyJwk)),
  )}`
  return id
}


const calculateJwkThumbprintUri = async (publicKeyJwk: RestrictedPublicKeyJwk) => {
  const kid = await jose.calculateJwkThumbprintUri(publicKeyJwk);
  return '#' + kid;
};

const key = { generate, format: formatJwk, did: publicKeyToDid, kid: calculateJwkThumbprintUri }

const controller = { key, signer, verifier }

export default controller

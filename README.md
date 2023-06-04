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

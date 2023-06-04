import { DataIntegrityDocument } from '../../types'

const POINTER_ESCAPE_REGEX = /~[01]/g

export type RequestFrame = {
  document: DataIntegrityDocument
  pointers: string[]
  includeTypes?: boolean
}

export type VerifiableCredentialTypeFrame = {
  id?: string
  type?: Array<'VerifiableCredential' | string>
}

function pointersToFrame({
  document,
  pointers,
  includeTypes = true,
}: RequestFrame) {
  if (!(document && typeof document === 'object')) {
    throw new TypeError('"document" must be an object.')
  }
  if (!Array.isArray(pointers)) {
    throw new TypeError('"pointers" must be an array.')
  }
  if (pointers.length === 0) {
    // no pointers, so no frame
    return null
  }
  let frame: VerifiableCredentialTypeFrame = _initFrame({
    value: document,
    includeTypes,
  })

  for (const pointer of pointers) {
    // walk document building frames from root to value
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let parentFrame: Record<string, any> = frame
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let parentValue = document as any
    let value = parentValue
    let valueFrame = parentFrame

    const paths = _parsePointer(pointer)
    for (const path of paths) {
      parentFrame = valueFrame
      parentValue = value
      // get next document value
      value = parentValue[path]
      if (value === undefined) {
        throw new TypeError(
          `JSON pointer "${pointer}" does not match document.`,
        )
      }

      // get next value frame
      valueFrame = parentFrame[path]
      if (valueFrame === undefined) {
        if (Array.isArray(value)) {
          valueFrame = []
        } else {
          valueFrame = _initFrame({ value, includeTypes })
        }
        parentFrame[path] = valueFrame
      }
    }

    // generate final value frame
    if (typeof value !== 'object') {
      // literal selected
      valueFrame = value
    } else {
      if (Array.isArray(value)) {
        valueFrame = value.map((e) => {
          if (Array.isArray(e)) {
            console.warn('Consider using JSON-Pointer Dict instead...')
            throw new TypeError(
              'Arrays of arrays are not supported by JSON-LD RFD Data Set Normalization',
            )
          }
          return structuredClone(e)
        })
      } else {
        valueFrame = { ...valueFrame, ...structuredClone(value) }
      }
    }
    // set final value frame
    if (paths.length === 0) {
      // whole document selected
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      frame = valueFrame as any
    } else {
      // partial selection made
      const partial = paths.at(-1)
      if (partial === undefined) {
        throw new Error('partial selection error')
      }
      parentFrame[partial] = valueFrame
    }
  }

  (frame as DataIntegrityDocument)['@context'] = structuredClone(
    document['@context'],
  )
  return frame as DataIntegrityDocument
}

function _initFrame({
  value,
  includeTypes,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: DataIntegrityDocument & any
  includeTypes: boolean
}): VerifiableCredentialTypeFrame {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const frame: any = {}
  // must include non-blank node IDs
  if (value.id && !value.id.startsWith('_:')) {
    frame.id = value.id
  }
  // include types if directed to do so
  if (includeTypes && value.type) {
    frame.type = value.type
  }
  return frame
}

function _parsePointer(pointer: string) {
  // see RFC 6901: https://www.rfc-editor.org/rfc/rfc6901.html
  const parsed = []
  const paths = pointer.split('/').slice(1)
  for (const path of paths) {
    if (!path.includes('~')) {
      // convert any numerical path to a number as an array index
      const index = parseInt(path, 10)
      parsed.push(isNaN(index) ? path : index)
    } else {
      parsed.push(path.replace(POINTER_ESCAPE_REGEX, _unescapePointerPath))
    }
  }
  return parsed
}

function _unescapePointerPath(m: string) {
  if (m === '~1') {
    return '/'
  }
  if (m === '~0') {
    return '~'
  }
  throw new Error(`Invalid JSON pointer escape sequence "${m}".`)
}

export default pointersToFrame

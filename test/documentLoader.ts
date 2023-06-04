import contexts from './contexts'
export const documentLoader = async (id: string) => {
  if (contexts[id]) {
    return { document: contexts[id] }
  }
  const message = 'Unsupported id: ' + id
  console.error(message)
  throw new Error(message)
}

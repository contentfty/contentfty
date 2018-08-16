import documentBlock from './DocumentBlock'

export default document => ({
  name: 'test-name',
  blocks: [documentBlock(), documentBlock(), documentBlock()],
  ...document
})

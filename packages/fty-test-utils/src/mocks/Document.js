import faker from 'faker'
import documentBlock from './DocumentBlock'

export default document => ({
  name: faker.lorem.word(),
  blocks: [documentBlock(), documentBlock(), documentBlock()],
  ...document
})

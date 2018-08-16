import faker from 'faker'

export default navLink => ({
  label: faker.lorem.word(),
  icon: 'plus',
  url: faker.internet.url(),
  ...navLink
})

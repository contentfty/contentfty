import { mocks } from '@fty/fty-test-utils'

export default {
  user: () => mocks.user(),
  navLinks: () => mocks.createManyMocks(mocks.navLink, 5),
  breadcrumbLinks: () => mocks.createManyMocks(mocks.link, 3),
  files: () =>
    mocks.createManyMocks(() => mocks.file({ type: 'DOCUMENT' }), 200),
  document: id => mocks.document({ id })
}

import faker from 'faker'
import config from '@tipe/tipe-config'
import { BLOCK_TYPES } from '@tipe/tipe-constants'
import documentBlockValidationMock from './DocumentBlockValidation'

export default documentBlock => {
  const type = Object.keys(BLOCK_TYPES)[
    faker.random.number({ min: 0, max: Object.keys(BLOCK_TYPES).length - 1 })
  ]

  return {
    type,
    label: config.blocks[type].label,
    value: '',
    name: faker.lorem.word(),
    apiId: faker.random.word(),
    description: faker.lorem.sentence(),
    status: ['success', 'warning', 'error'][
      faker.random.number({ min: 0, max: 2 })
    ],
    successMessage: faker.lorem.sentence(),
    errorMessage: faker.lorem.sentence(),
    warningMessage: faker.lorem.sentence(),
    waiting: faker.random.boolean(),
    disabled: faker.random.boolean(),
    validation: documentBlockValidationMock(),
    ...documentBlock
  }
}

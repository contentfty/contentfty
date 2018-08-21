const {updateSchema} = require('../index')

const readModel = async function () {
  let modelTypes = []
  return modelTypes
}

const writeModel = async function (newModel) {
  let result = []
  await updateSchema()
  return result
}

const getTypesNames = function (model) {
  return model.map(type => type.name)
}

module.exports = {
  readModel,
  writeModel,
  getTypesNames
}
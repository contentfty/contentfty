const path = require('path')
const fs = require('fs-extra')

const {updateSchema} = require('../index')

const readModel = async function () {
  // const modelPath = pat.resolve()
  const sourcesPath = path.resolve('../fty-server/src/apollo/sources/sources.json')
  const sourcesTypes = await fs.readJson(sourcesPath)
  let modelTypes = []
  return [...sourcesTypes, ...modelTypes]
  // return modelTypes
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

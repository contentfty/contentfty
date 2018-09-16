const path = require('path')
const fs = require('fs-extra')

const {updateSchema} = require('../index')

/**
 * 根据 SpaceId 读取全部内容模型
 * @returns {Promise<*[]>}
 */
const readModel = async function (spaceId) {
  // 数据模型就是表结构

  // const modelPath = pat.resolve()
  const sourcesPath = path.resolve('../fty-server/src/apollo/sources/sources.json')
  const sourcesTypes = await fs.readJson(sourcesPath)

  // 查询 entryTypes model
  const entryTypesModel = think.model('entrytypes', {spaceId: spaceId})
  const entryTypes = await entryTypesModel.getAll()
  return [...sourcesTypes, ...entryTypes]
  // return [...sourcesTypes]
}

/**
 * 写入新内容模型
 * @param newModel
 * @returns {Promise<Array>}
 */
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

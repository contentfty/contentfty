const _ = require('lodash')
const { isArray, isObject, partition, values } = require('lodash')

const linkIsValid = function(link, stack, modelTypes) {
  return []
}

const inspectLnk = async function(link, stack, modelTypes) {
  return {}
}
const inspectLinks = async function(links, stack, modelTypes) {
  return []
}
const inspectMap = async function(map, stack, modelTypes) {
  return []
}
/**
 * 条目检查
 * @param type
 * @param id
 * @param modelTypes
 * @param stack
 * @returns {Promise<Array>}
 */
const inspectEntry = async function (type, id, modelTypes, stack = []) {
  return []
}

/**
 * 序列化查询
 * @param query
 * @returns {*}
 */
const graphqlQuerySerialize = function (query) {
  try {
    if (isArray(query)) {
      return query
        .map(graphqlQuerySerialize)
        .filter(value => value !== '')
        .join(', ')
    }

    if (isObject(query)) {
      return _(query)
        .map((value, key) => {
          const serialize = graphqlQuerySerialize(value)
          return serialize === '' ? '' : `${key} {${serialize}}`
        })
        .filter(value => value !== '')
        .join(', ')
    }
    return query
  } catch(error) {
    throw error
  }
}

module.exports = {
  inspectEntry,
  graphqlQuerySerialize
}

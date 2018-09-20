/* eslint-disable no-unused-expressions,no-confusing-arrow */
const { mapSeries } = require('bluebird');
const { isObject, isArray, toPairs } = require('lodash');

const { readType, readEntry } = require('./db/read');
const { inspectEntry, graphqlQuerySerialize } = require('./db/inspect');

const read = async function (type, spaceId, method, args) {
  const suffixMethods = [
    'ById',
    'ByIds',
    'One',
    'Many',
    'Total',
    'Pagination'
  ]
  switch (method) {
    case 'ById': {
      return await readEntry({ type, spaceId, id: args.id})
    }
    case 'ByIds': {}
    case 'One': {}
    case 'Many': {}
    case 'Total': {}
    case 'Pagination': {}
  }
  // console.log(type)
  // console.log(spaceId)
  // console.log(method)
  // console.log(args)
  // if ID Query single object els All
  // return id === null ? await readType({ type, spaceId, skip, limit, where }) : [await readEntry({ type, id, spaceId })];
}

// const readCollection = function (type, spaceId, skip, limit) {
//   return readType({ type, spaceId, skip, limit })
// }
const inspect = async function (root, modelTypes) {
  const inspection = await inspectEntry(root._type_, root._id_, modelTypes);
  return graphqlQuerySerialize(inspection);
}

/**
 * 获取子列表
 *
 * @param links
 * @param modelTypes
 * @returns {*}
 */
const readChildren = async function (links, modelTypes, spaceId) {
  switch (links) {
    case 'Field': {
      return await think.model('fields', { spaceId: spaceId }).where({ typeId: modelTypes }).select()
    }
  }
}

/**
 * 读取子元素
 * @param link
 * @returns {*}
 */
const readChild = function (type, id) {
  // if (!isObject(link)) {
  //   return null;
  // }
  // const {type, id} = link.link;
  // return readEntry(type, id, null);
  const spaceId = null
  return readEntry({ type, id, spaceId });
}

const readMap = function (map, modelTypes) {
  if (!isObject(map)) {
    return null;
  }
  return mapSeries(
    toPairs(map.map),
    pair =>
      isArray(pair[1])
        ? {
          _key_: pair[0],
          _list_: readChildren({ links: pair[1] }, modelTypes)
        }
        : { _key_: pair[0], _value_: readChild({ link: pair[1] }) }
  );
}

module.exports = {
  read,
  inspect,
  readChildren,
  readChild,
  readMap
}

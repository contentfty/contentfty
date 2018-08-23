/* eslint-disable no-unused-expressions,no-confusing-arrow */
const {mapSeries} = require('bluebird');
const {isObject, isArray, toPairs} = require('lodash');

const {readType, readEntry} = require('./db/read');
const {inspectEntry, graphqlQuerySerialize} = require('./db/inspect');

const read = function (type, id = null, spaceId = null) {
  // if ID Query single object els All
  return id === null ? readType(type) : [readEntry({type, id, spaceId})];
}

const inspect = async function (root, modelTypes) {
  const inspection = await inspectEntry(root._type_, root._id_, modelTypes);
  return graphqlQuerySerialize(inspection);
}

const readChildren = function (links, modelTypes) {
  if (!isObject(links)) {
    return null;
  }
  return Promise.all(
    links.links.filter(link => modelTypes.includes(link.type)).map(link => {
      const {type, id} = link;
      const spaceId = null
      return readEntry({type, id, spaceId});
    })
  );
}

const readChild = function (link) {
  if (!isObject(link)) {
    return null;
  }
  const {type, id} = link.link;
  return readEntry(type, id);
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
          _list_: readChildren({links: pair[1]}, modelTypes)
        }
        : {_key_: pair[0], _value_: readChild({link: pair[1]})}
  );
}

module.exports = {
  read,
  inspect,
  readChildren,
  readChild,
  readMap
}

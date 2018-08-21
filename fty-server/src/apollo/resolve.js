/* eslint-disable no-unused-expressions,no-confusing-arrow */
import {mapSeries} from 'bluebird';
import {isObject, isArray, toPairs} from 'lodash';

import {readType, readEntry} from './db/read';
import {inspectEntry, graphqlQuerySerialize} from './db/inspect';

const read = function (type, id = null) {
  return id === null ? readType(type) : [readEntry(type, id)];
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
      return readEntry(type, id);
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

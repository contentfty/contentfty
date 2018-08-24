const _ = require('lodash')
const {readEntry} = require('./read')

const emptyField = function (field) {
  const role = field._role_
  return _.isEmpty(field) || _.isUndefined(role) !== _.isEmpty(field[role])
}
const writeEntry = async function (type, data) {
  return null
}

module.export = {
  emptyField,
  writeEntry
}

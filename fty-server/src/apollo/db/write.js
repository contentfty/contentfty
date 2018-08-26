/* eslint-disable no-fallthrough,no-undef */
const _ = require('lodash')
const {readEntry} = require('./read')
const fty = think.service('fty')

const emptyField = function (field) {
  // const role = field._role_
  // return _.isEmpty(field) || _.isUndefined(role) !== _.isEmpty(field[role])
  return null
}
const writeEntry = async function (type, data, context) {
  switch (type) {
    case 'User': {
      return await fty.createUser(data)
    }
    case 'Org': {
      return await fty.createOrg(data.name, context.user)
    }
    case 'Space': {
      return await fty.createSpace(data, context.user)
    }
    case 'EntryType': {
      return await fty.createContentType(data, context.user, context.spaceId)
    }
    case 'Entry': {
      return await fty.createEntry(data, context.user, context.spaceId)
    }
    case 'Field': {
      return await fty.createField(data, context.spaceId)
    }
    default: {
      return null
    }
  }
}

module.exports = {
  emptyField,
  writeEntry
}

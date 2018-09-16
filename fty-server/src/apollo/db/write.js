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
      return await fty.saveUser(data)
    }
    case 'Org': {
      return await fty.saveOrg(data, context.user)
    }
    case 'Space': {
      return await fty.saveSpace(data, context.user)
    }
    case 'EntryType': {
      return await fty.saveEntryType(data, context.user, context.spaceId)
    }
    case 'Entry': {
      return await fty.saveEntry(data, context.user, context.spaceId)
    }
    case 'Field': {
      return await fty.saveField(data, context.spaceId)
    }
    default: {
      // console.log(type)
      return await fty.saveEntry(type, data, context.user, context.spaceId)
      // return await fty.saveEntryContent(data, context.user, context.spaceId)
      // return null
    }
  }
}

module.exports = {
  emptyField,
  writeEntry
}

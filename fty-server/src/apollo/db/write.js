/* eslint-disable no-fallthrough,no-undef */
const _ = require('lodash')
const {readEntry} = require('./read')
const fty = think.service('fty')

const emptyField = function (field) {
  const role = field._role_
  return _.isEmpty(field) || _.isUndefined(role) !== _.isEmpty(field[role])
}
const writeEntry = async function (type, data, user) {
  const userModel = think.model('users')
  // console.log(user)
  // console.log('user --d-d-d-d-')
  switch (type) {
    case 'User': {
      const fieldModel = think.model('users')
      // await fieldModel.save(data)
      // const userData = await fieldModel.getById(id)
      // return userData
    }
    case 'Entry': {
      // const fieldModel = think.model('entries', {spaceId: spaceId});
      // 返回条目类型mwwp
    }
    case 'Org': {
      return await fty.createOrg(data.name, user)
    }
    case 'Space': {
      return await fty.createSpace(data, user)
    }
    case 'Field': {
      return null
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

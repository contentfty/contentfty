/* eslint-disable no-fallthrough,no-undef */
const fty = think.service('fty')

const updateEntry = async function (type, data, context) {
  switch (type) {
    case 'User': {
      return await fty.updateUser(data)
    }
    // case 'Org': {
    //   return await fty.createOrg(data.name, context.user)
    // }
    // case 'Space': {
    //   return await fty.createSpace(data, context.user)
    // }
    case 'EntryType': {
      return await fty.updateContentType(data, context.spaceId)
    }
    // case 'Entry': {
    //   return await fty.createEntry(data, context.user, context.spaceId)
    // }
    // case 'Field': {
    //   return await fty.createField(data, context.spaceId)
    // }
    default: {
      return null
    }
  }
}

module.exports = {
  updateEntry
}

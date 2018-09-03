const fty = think.service('fty')

const deleteEntry = async function (type, data, context) {
  switch (type) {
    case 'User': {
      const isDelete = await fty.deleteUser(data)
      return isDelete ? json(0, 'success') : json(1, 'fail')
    }
    case 'Entry': {
      const isDelete = await fty.deleteEntry(data,context.spaceId)
      return isDelete ? json(0, 'success') : json(1, 'fail')
    }
    case 'EntryType': {
      const isDelete = await fty.deleteEntryType(data, context.spaceId)
      return isDelete ? json(0, 'success') : json(1, 'fail')
    }
    case 'Org': {
      return null
    }
    case 'Space': {
      const isDelete = await fty.deleteSpace(data)
      return isDelete ? json(0, 'success') : json(1, 'fail')
    }
    case 'Field': {
      const isDelete = await fty.deleteField(data,context.user,context.spaceId)
      return isDelete ? json(0, 'success') : json(1, 'fail')
    }
    default: {
      return null;
    }
  }
}

/**
 * 响应结果
 * @param {状态:0 成功} code 
 * @param {消息} message 
 */
const json = function (code, message) {
  return { code: code, message: message }
}

module.exports = {
  deleteEntry
}

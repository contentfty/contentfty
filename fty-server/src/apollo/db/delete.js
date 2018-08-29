const fty = think.service('fty')

const deleteEntry = async function (type, data, context) {
  switch (type) {
    case 'User': {
      const isDelete = await fty.deleteUser(data)
      return isDelete ? json(0, 'success') : json(1, 'fail')
    }
    case 'Entry': {
      return null;
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
      return null
    }
    default: {
      // const entries = await think.model('entries').where({typeId: type}).select()
      // const ids = think._.map(entries, 'id')
      // // 临时测试处理
      // const entryList = await think.model('entryversions').where(
      //   {
      //     id: ['IN', ids]
      //   }
      // ).select()
      // for(let obj of entryList) {
      //   obj.fields = JSON.parse(obj.fields)
      // }
      // const fields = think._.map(entryList, 'fields')
      // return fields
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

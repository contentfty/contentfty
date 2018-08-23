const readeType = async function () {
  return []
}

const readEntry = async function ({type, id, spaceId}) {
  console.log('Type is ......')
  console.log(type)
  console.log(id)
  if (id === 'undefined') {
    return null
  }

  switch (type) {
    case 'User': {
      const fieldModel = think.model('users');
      const userData = await fieldModel.getById(id)
      return userData
    }
    case 'Entry': {
      const fieldModel = think.model('entries', {spaceId: spaceId});
    }
    default: {
      return null
    }
  }

  // const fields = await fieldModel.findByGroupId(args.groupId);
  // return fields;
  //
  // return null
}

module.exports = {
  readeType,
  readEntry
}

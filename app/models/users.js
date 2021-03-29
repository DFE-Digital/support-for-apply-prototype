const path = require('path')
const fs = require('fs')

const directoryPath = path.join(__dirname, '../data/')

exports.save = (data) => {
  console.log(data);
}

exports.find = (data) => {
  const filePath = directoryPath + '/users.json';

  const rawData = fs.readFileSync(filePath)
  let users = JSON.parse(rawData)

  if (data !== undefined) {



  }

  return users
}

exports.findByProviderId = (providerId) => {
  const filePath = directoryPath + '/users.json';

  const rawData = fs.readFileSync(filePath)
  let users = JSON.parse(rawData)

  users = users.filter((user) => {
    if (user.providers) {
      return user.providers.find((provider) => {
        return provider.code === providerId.toUpperCase()
      })
    }
  })

  return users
}

exports.findById = (providerId, userId) => {
  const users = this.findByProviderId(providerId)
  const user = users.filter(u => u.id == userId)
  return user[0]
}

exports.findByIdAndUpdate = (id, data) => {

}

exports.findByIdAndDelete = (id) => {

}

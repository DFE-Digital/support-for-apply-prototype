const path = require('path')
const fs = require('fs')
const { v4: uuid } = require('uuid')

const Providers = require('./providers')

const permissions = [
  'manage_organisations',
  'manage_users',
  'make_decisions',
  'view_safeguarding_information',
  'view_diversity_information'
]

const directoryPath = path.join(__dirname, '../data/users')

writeFileSync = (data) => {
  const raw = JSON.stringify(data)

  const fileName = data.id + '.json'
  const filePath = directoryPath + '/' + fileName

  // write the JSON data
  fs.writeFileSync(filePath, raw)
}

exports.save = (providerId, data) => {
  let user = this.find(data)[0]

  if (user.length) {
    this.updateOne(user.id, data)
  } else {
    this.insertOne(providerId, data)
  }

}

exports.saveMany = (providerId, data) => {
  const p = Providers.findOne(providerId)

  data.forEach((row, i) => {

    const user = {}
    user.id = uuid()
    user.first_name = row[0]
    user.last_name = row[1]
    user.email_address = row[2]
    user.created_at = new Date()
    user.send_notifications = true
    user.providers = []

    provider = {}
    provider.code = p.code
    provider.name = p.name
    provider.permissions = {}

    permissions.forEach((permission, i) => {
      provider.permissions[permission] = false
    })

    user.providers.push(provider)

    writeFileSync(user)
  })
}

exports.find = (data) => {
  let documents = fs.readdirSync(directoryPath,'utf8')

  // Only get JSON documents
  documents = documents.filter( doc => doc.match(/.*\.(json)/ig))

  let users = []

  documents.forEach((filename, i) => {
    const raw = fs.readFileSync(directoryPath + '/' + filename)
    const user = JSON.parse(raw)
    users.push(user)
  })

  if (data !== undefined) {

    if (data.email_address.length) {
      users = users.filter(u => u.email_address === data.email_address)
    }

  }

  return users
}

exports.findOne = (userId) => {
  const users = this.find()
  const user = users.filter(u => u.id == userId)
  return user[0]
}

exports.insertOne = (providerId, data) => {
  const p = Providers.findOne(providerId)
  // parse the submitted data into the structure we expect
  const user = {}
  user.id = uuid()
  user.first_name = data.first_name
  user.last_name = data.last_name
  user.email_address = data.email_address
  // user.dfe_uuid = data.dfe_uuid || uuid()
  user.created_at = new Date()
  user.send_notifications = data.send_notifications || true
  user.providers = []

  provider = {}
  provider.code = p.code
  provider.name = p.name
  provider.permissions = {}

  permissions.forEach((item, i) => {
    if (data.permissions.includes(item)) {
      provider.permissions[item] = true
    } else {
      provider.permissions[item] = false
    }
  })

  user.providers.push(provider)

  writeFileSync(user)
}

exports.insertMany = (data) => {

}

exports.updateOne = (userId, data) => {
  // parse the submitted data into the structure we expect
  let user = this.findOne(userId)
  user = {...user, ...data}

  // if (data.dfe_uuid.length) {
  //   user.dfe_uuid = data.dfe_uuid
  // }

  user.last_updated_at = new Date()

  // user.send_notifications = data.send_notifications || true

  // user.providers = []
  //
  // provider = {}
  // provider.code = p.code
  // provider.name = p.name
  // provider.permissions = {}
  //
  // permissions.forEach((item, i) => {
  //   if (data.permissions.includes(item)) {
  //     provider.permissions[item] = true
  //   } else {
  //     provider.permissions[item] = false
  //   }
  // })
  //
  // user.providers.push(provider)

  writeFileSync(user)
}

exports.updateMany = (data) => {

}

exports.deleteOne = (userId) => {
  const fileName = userId + '.json';
  fs.unlinkSync(directoryPath + '/' + fileName)
}

// ----------------------------------------------------------------------------

exports.findByProviderId = (providerId) => {
  let users = this.find()

  users = users.filter((user) => {
    if (user.providers) {
      return user.providers.find((provider) => {
        return provider.code === providerId.toUpperCase()
      })
    }
  })

  return users
}

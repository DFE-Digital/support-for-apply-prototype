const path = require('path')
const fs = require('fs')
const { v4: uuid } = require('uuid')

const Providers = require('./providers')
const DataHelper = require('../helpers/data')

const directoryPath = path.join(__dirname, '../data/users')

const writeFileSync = (data) => {
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

  data.forEach((item, i) => {

    const user = {}
    user.id = uuid()
    user.first_name = item.first_name
    user.last_name = item.last_name
    user.email_address = item.email_address
    user.created_at = new Date()
    user.send_notifications = true
    user.providers = []

    provider = {}
    provider.code = p.code
    provider.name = p.name
    provider.permissions = {}

    DataHelper.permissions.forEach((permission, i) => {
      if (item.permissions.includes(permission)) {
        provider.permissions[permission] = true
      } else {
        provider.permissions[permission] = false
      }
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

  users = users.sort((a, b) => {
    return a.first_name.localeCompare(b.first_name) || a.last_name.localeCompare(b.last_name)
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
  const user = users.filter(u => u.id == userId)[0]

  // TODO: update seed data with new notification object
  if (user.notifications === undefined) {
    user.notifications = {}
    DataHelper.notifications.forEach((notification, i) => {
      if (user.send_notifications) {
        user.notifications[notification] = true
      } else {
        user.notifications[notification] = false
      }
    })
  }

  return user
}

exports.insertOne = (providerId, data) => {
  const p = Providers.findOne(providerId)
  const user = {}

  user.id = uuid()
  user.first_name = data.first_name
  user.last_name = data.last_name
  user.email_address = data.email_address

  if (data.dfe_uuid) {
    user.dfe_uuid = data.dfe_uuid
  }

  user.notifications = {}

  DataHelper.notifications.forEach((notification, i) => {
    user.notifications[notification] = true
  })

  user.created_at = new Date()

  user.providers = []

  provider = {}
  provider.code = p.code
  provider.name = p.name
  provider.permissions = {}

  DataHelper.permissions.forEach((permission, i) => {
    if (data.permissions.includes(permission)) {
      provider.permissions[permission] = true
    } else {
      provider.permissions[permission] = false
    }
  })

  user.providers.push(provider)

  writeFileSync(user)

  return user.id
}

exports.insertMany = (data) => {

}

exports.updateOne = (userId, data) => {
  let user = this.findOne(userId)

  user.id = userId
  user.first_name = data.first_name
  user.last_name = data.last_name
  user.email_address = data.email_address
  user.dfe_uuid = data.dfe_uuid
  user.notifications = data.notifications
  user.updated_at = new Date()

  writeFileSync(user)
}

exports.updateMany = (data) => {

}

exports.deleteOne = (userId) => {
  const fileName = userId + '.json';
  fs.unlinkSync(directoryPath + '/' + fileName)
}

exports.updatePermissions = (userId, data) => {
  const user = this.findOne(userId)
  user.providers = []

  for (const [key, value] of Object.entries(data.providers)) {
    const p = Providers.findOne(key)

    const provider = {}
    provider.code = p.code
    provider.name = p.name
    provider.permissions = {}

    DataHelper.permissions.forEach((permission, i) => {
      if (value.permissions.includes(permission)) {
        provider.permissions[permission] = true
      } else {
        provider.permissions[permission] = false
      }
    })

    user.providers.push(provider)

  }

  user.updated_at = new Date()

  writeFileSync(user)
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

const path = require('path')
const fs = require('fs')
const { v4: uuid } = require('uuid')

const Providers = require('./providers')

const directoryPath = path.join(__dirname, '../data/users')

exports.save = (providerId, data) => {
  // TODO: check user doesn't exist through being added via a different provider

  const p = Providers.findById(providerId)

  const permissions = [
    'manage_organisations',
    'manage_users',
    'make_decisions',
    'view_safeguarding_information',
    'view_diversity_information'
  ]

  // parse the submitted data into the structure we expect
  const user = {}
  user.id = uuid()
  user.first_name = data.first_name
  user.last_name = data.last_name
  user.email_address = data.email_address
  user.dfe_uuid = data.dfe_uuid || uuid()
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

  const raw = JSON.stringify(user)

  const fileName = user.id + '.json'
  const filePath = directoryPath + '/' + fileName

  // write the JSON data
  fs.writeFileSync(filePath, raw)
}

exports.find = (data) => {
  let documents = fs.readdirSync(directoryPath,'utf8')

  // Only get JSON documents
  documents = documents.filter( doc => doc.match(/.*\.(json)/ig))

  const users = []

  documents.forEach((filename, i) => {
    const raw = fs.readFileSync(directoryPath + '/' + filename)
    const user = JSON.parse(raw)
    users.push(user)
  })

  return users
}

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

exports.findById = (providerId, userId) => {
  const users = this.findByProviderId(providerId)
  const user = users.filter(u => u.id == userId)
  return user[0]
}

exports.findByIdAndUpdate = (userId, data) => {

  // TODO:
  // 1. Read user data into memory
  // 2. Parse form data into correct structure
  // 3. Update user content
  // 4. Write data to user file
}

exports.findByIdAndDelete = (userId) => {
  const fileName = userId + '.json';
  fs.unlinkSync(directoryPath + '/' + fileName)
}

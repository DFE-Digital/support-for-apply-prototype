const Providers = require('../models/providers')
const Users = require('../models/users')

const DataHelper = require('../helpers/data')
const ValidationHelper = require('../helpers/validators')

const CSV = require('csv-string')

// convert an array of user arrays into an array of user objects
const parseRawUserData = (array) => {
  const users = []
  array.forEach((row, i) => {
    const user = {}
    user.first_name = row[0]
    user.last_name = row[1]
    user.email_address = row[2]
    user.permissions = []
    users.push(user)
  })
  return users
}

exports.list_get = (req, res) => {
  const provider = Providers.findOne(req.params.providerId)
  const users = Users.findByProviderId(req.params.providerId)
  const message = req.flash()
  delete req.session.data.upload
  res.render('../views/providers/users/index', {
    provider,
    users,
    message
  })
}

exports.show_get = (req, res) => {
  const provider = Providers.findOne(req.params.providerId)
  const user = Users.findOne(req.params.userId)
  const notifications = DataHelper.notifications
  const message = req.flash()
  if (user) {
    res.render('../views/providers/users/show', {
      provider,
      user,
      notifications,
      message
    })
  } else {
    res.redirect(`/providers/${req.params.providerId}/users`)
  }
}

exports.history_get = (req, res) => {
  const provider = Providers.findOne(req.params.providerId)
  const user = Users.findOne(req.params.userId)
  if (user) {
    res.render('../views/providers/users/history', {
      provider,
      user
    })
  } else {
    res.redirect(`/providers/${req.params.providerId}/users`)
  }
}

exports.new_get = (req, res) => {
  const provider = Providers.findOne(req.params.providerId)
  const message = req.flash()
  res.render('../views/providers/users/new', {
    provider,
    message
  })
}

exports.new_post = (req, res) => {
  const errors = []

  if (!req.session.data.user.first_name.length) {
    const error = {}
    error.fieldName = 'first_name'
    error.href = '#first_name'
    error.text = 'Enter a first name'
    errors.push(error)
  }

  if (!req.session.data.user.last_name.length) {
    const error = {}
    error.fieldName = 'last_name'
    error.href = '#last_name'
    error.text = 'Enter a last name'
    errors.push(error)
  }

  if (!req.session.data.user.email_address.length) {
    const error = {}
    error.fieldName = 'email_address'
    error.href = '#email_address'
    error.text = 'Enter an email address'
    errors.push(error)
  } else if (!ValidationHelper.isValidEmail(req.session.data.user.email_address)) {
    const error = {}
    error.fieldName = 'email_address'
    error.href = '#email_address'
    error.text = 'Enter an email address in the correct format, like name@example.com'
    errors.push(error)
  }

  // if (req.session.data.user.dfe_uuid.length && !ValidationHelper.isValidUuid(req.session.data.user.dfe_uuid)) {
  //   const error = {}
  //   error.fieldName = 'dfe_uuid'
  //   error.href = '#dfe_uuid'
  //   error.text = 'Enter a DfE Sign-in ID in the correct format, like b9a734d2-6006-4071-b009-30c87833493b'
  //   errors.push(error)
  // }

  if (errors.length) {
    const provider = Providers.findOne(req.params.providerId)
    res.render('../views/providers/users/new', {
      provider,
      errors
    })
  } else {
    const userId = Users.insertOne(req.params.providerId, req.session.data.user)
    req.flash('success', `User ${req.session.data.user.first_name} ${req.session.data.user.last_name} added`)
    delete req.session.data.user
    if (req.session.data.button.submit === 'continue') {
      res.redirect(`/providers/${req.params.providerId}/users/new`)
    } else {
      res.redirect(`/providers/${req.params.providerId}/users`)
    }
  }
}

exports.edit_get = (req, res) => {
  const provider = Providers.findOne(req.params.providerId)
  const user = Users.findOne(req.params.userId)

  if (user) {
    res.render('../views/providers/users/edit', {
      provider,
      user
    })
  } else {
    res.redirect(`/providers/${req.params.providerId}/users`)
  }
}

exports.edit_post = (req, res) => {
  const errors = []

  if (!req.session.data.user.first_name.length) {
    const error = {}
    error.fieldName = 'first_name'
    error.href = '#first_name'
    error.text = 'Enter a first name'
    errors.push(error)
  }

  if (!req.session.data.user.last_name.length) {
    const error = {}
    error.fieldName = 'last_name'
    error.href = '#last_name'
    error.text = 'Enter a last name'
    errors.push(error)
  }

  if (!req.session.data.user.email_address.length) {
    const error = {}
    error.fieldName = 'email_address'
    error.href = '#email_address'
    error.text = 'Enter an email address'
    errors.push(error)
  } else if (!ValidationHelper.isValidEmail(req.session.data.user.email_address)) {
    const error = {}
    error.fieldName = 'email_address'
    error.href = '#email_address'
    error.text = 'Enter an email address in the correct format, like name@example.com'
    errors.push(error)
  }

  if (req.session.data.user.dfe_uuid.length && !ValidationHelper.isValidUuid(req.session.data.user.dfe_uuid)) {
    const error = {}
    error.fieldName = 'dfe_uuid'
    error.href = '#dfe_uuid'
    error.text = 'Enter a DfE Sign-in ID in the correct format, like b9a734d2-6006-4071-b009-30c87833493b'
    errors.push(error)
  }

  if (errors.length) {
    const provider = Providers.findOne(req.params.providerId)
    let user = Users.findOne(req.params.userId)
    user = {...user, ...req.session.data.user}
    res.render('../views/providers/users/edit', {
      provider,
      user,
      errors
    })
  } else {
    Users.updateOne(req.params.userId, req.session.data.user)
    req.flash('success', `User ${req.session.data.user.first_name} ${req.session.data.user.last_name} updated`)
    delete req.session.data.user
    res.redirect(`/providers/${req.params.providerId}/users/${req.params.userId}`)
  }
}

exports.delete_get = (req, res) => {
  const provider = Providers.findOne(req.params.providerId)
  const user = Users.findOne(req.params.userId)
  res.render('../views/providers/users/delete', {
    provider,
    user
  })
}

exports.delete_post = (req, res) => {
  const user = Users.findOne(req.params.userId)
  req.flash('success', `User ${user.first_name} ${user.last_name} deleted`)
  Users.deleteOne(req.params.userId)
  res.redirect(`/providers/${req.params.providerId}/users`)
}

exports.edit_permissions_get = (req, res) => {
  const provider = Providers.findOne(req.params.providerId)
  const user = Users.findOne(req.params.userId)
  res.render('../views/providers/users/permissions', {
    provider,
    user
  })
}

exports.edit_permissions_post = (req, res) => {
  const user = Users.findOne(req.params.userId)
  Users.updatePermissions(req.params.userId, req.session.data.user)
  delete req.session.data.user
  req.flash('success', `User ${user.first_name} ${user.last_name}’s organisation permissions updated`)
  res.redirect(`/providers/${req.params.providerId}/users/${req.params.userId}`)
}

exports.new_upload_get = (req, res) => {
  const provider = Providers.findOne(req.params.providerId)
  // clear any previously uploaded data
  delete req.session.data.upload
  res.render('../views/providers/users/upload/new', {
    provider
  })
}

exports.new_upload_post = (req, res) => {
  let raw = req.session.data.upload.raw
  raw = raw.trim()

  const errors = []

  if (!raw.length) {
    const error = {}
    error.fieldName = 'raw'
    error.href = '#raw'
    error.text = 'Enter the users’ details'
    errors.push(error)
  }

  if (errors.length) {
    const provider = Providers.findOne(req.params.providerId)
    res.render('../views/providers/users/upload/new', {
      provider,
      errors
    })
  } else {
    // dynamically work out the delimiter used in the data
    const delimiter = CSV.detect(raw)

    // parse the data and populate the session data
    const index = CSV.readAll(raw, delimiter, data => {
      req.session.data.upload.users = data
    })

    // set a new array and populate with parsed users
    req.session.data.users = parseRawUserData(req.session.data.upload.users)

    // set the position counter so we can iterate through the users and keep track
    req.session.data.upload.position = 0

    res.redirect(`/providers/${req.params.providerId}/users/upload/permissions`)
  }
}

exports.new_upload_permissions_get = (req, res) => {
  const provider = Providers.findOne(req.params.providerId)

  if (req.query.action === 'change' || req.query.action === 'back') {
    // get the position of the user we want to edit
    req.session.data.upload.position = parseInt(req.query.position)
  }

  const userCount = req.session.data.upload.users.length
  const currentUserNum = req.session.data.upload.position + 1

  // set the save route for new or change flow
  let save = `/providers/${provider.code}/users/upload/permissions`
  // if (req.headers.referer.includes('check-your-answers')) {
  if (req.query.action === 'change') {
    save = save + '?action=change'
  }

  // set the back route for new or change flow
  let back = `/providers/${provider.code}/users/upload`
  if (req.query.action === 'change') {
    back = `/providers/${provider.code}/users/upload/check`
  } else if (req.session.data.upload.position) {
    const previousPosition = req.session.data.upload.position - 1
    back = `/providers/${provider.code}/users/upload/permissions?action=back&position=${previousPosition}`
  }

  // get the user from the parsed users
  const user = req.session.data.users[req.session.data.upload.position]

  res.render('../views/providers/users/upload/permissions', {
    provider,
    user,
    userCount,
    currentUserNum,
    save,
    back
  })
}

exports.new_upload_permissions_post = (req, res) => {
  const errors = []

  if (!req.session.data.user.first_name.length) {
    const error = {}
    error.fieldName = 'first_name'
    error.href = '#first_name'
    error.text = 'Enter a first name'
    errors.push(error)
  }

  if (!req.session.data.user.last_name.length) {
    const error = {}
    error.fieldName = 'last_name'
    error.href = '#last_name'
    error.text = 'Enter a last name'
    errors.push(error)
  }

  if (!req.session.data.user.email_address.length) {
    const error = {}
    error.fieldName = 'email_address'
    error.href = '#email_address'
    error.text = 'Enter an email address'
    errors.push(error)
  } else if (!ValidationHelper.isValidEmail(req.session.data.user.email_address)) {
    const error = {}
    error.fieldName = 'email_address'
    error.href = '#email_address'
    error.text = 'Enter an email address in the correct format, like name@example.com'
    errors.push(error)
  }

  if (errors.length) {
    const provider = Providers.findOne(req.params.providerId)
    const user = req.session.data.user

    const userCount = req.session.data.upload.users.length
    const currentUserNum = req.session.data.upload.position + 1

    // set the save route for new or change flow
    let save = `/providers/${provider.code}/users/upload/permissions`
    if (req.query.action === 'change') {
      save = save + '?action=change'
    }

    // set the back route for new or change flow
    let back = `/providers/${provider.code}/users/upload`
    if (req.query.action === 'change') {
      back = `/providers/${provider.code}/users/upload/check`
    } else if (req.session.data.upload.position) {
      const previousPosition = req.session.data.upload.position - 1
      back = `/providers/${provider.code}/users/upload/permissions?action=back&position=${previousPosition}`
    }

    res.render('../views/providers/users/upload/permissions', {
      provider,
      user,
      errors,
      userCount,
      currentUserNum,
      save,
      back
    })
  } else {

    // replace the data held in the session with the changed data
    req.session.data.users.splice(req.session.data.upload.position, 1, req.session.data.user)

    // delete the user object read for the next item in the flow
    delete req.session.data.user

    // if we've reached the last person, move to the next step, else next continue
    if (req.session.data.upload.position === (req.session.data.upload.users.length - 1)
      || req.session.data.action === 'change') {
      delete req.session.data.action
      res.redirect(`/providers/${req.params.providerId}/users/upload/check`)
    } else {
      // increment the position to track where we are in the flow
      req.session.data.upload.position += 1
      res.redirect(`/providers/${req.params.providerId}/users/upload/permissions`)
    }
  }

}

exports.new_upload_check_get = (req, res) => {
  const provider = Providers.findOne(req.params.providerId)
  const users = req.session.data.users
  res.render('../views/providers/users/upload/check-your-answers', {
    provider,
    users
  })
}

exports.new_upload_check_post = (req, res) => {
  Users.saveMany(req.params.providerId, req.session.data.users)
  if (req.session.data.users.length === 1) {
    req.flash('success', `User ${req.session.data.users[0].first_name} ${req.session.data.users[0].last_name} added`)
  } else {
    req.flash('success', `${req.session.data.users.length} users added`)
  }
  delete req.session.data.upload
  delete req.session.data.users
  res.redirect(`/providers/${req.params.providerId}/users`)
}

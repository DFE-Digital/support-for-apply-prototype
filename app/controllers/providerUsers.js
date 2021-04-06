const Providers = require('../models/providers')
const Users = require('../models/users')

const ValidationHelper = require('../helpers/validators')

const CSV = require('csv-string')

// const parseUploadedUsers = (array) => {
//   const users = []
//
//   array.forEach((item, i) => {
//     const user = {}
//     user.first_name = item[0]
//     user.last_name = item[1]
//     user.email_address = item[2]
//     users.push(user)
//   })
//
//   return users
// }

// const parseEmailsToList = (array) => {
//   const emails = []
//
//   array.forEach((item, i) => {
//     emails.push(item[2])
//   })
//
//   return emails
// }

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

  if (user) {
    res.render('../views/providers/users/show', {
      provider,
      user
    })
  } else {
    res.redirect(`/providers/${req.params.providerId}/users`)
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

  if (errors.length) {
    const provider = Providers.findOne(req.params.providerId)
    const user = req.session.data.user
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

  if (errors.length) {
    const provider = Providers.findOne(req.params.providerId)
    res.render('../views/providers/users/new', {
      provider,
      errors
    })
  } else {
    const userId = Users.insertOne(req.params.providerId, req.session.data.user)
    req.flash('success', `New user ${req.session.data.user.first_name} ${req.session.data.user.last_name} added`)
    delete req.session.data.user
    if (req.session.data.button.submit == 'continue') {
      res.redirect(`/providers/${req.params.providerId}/users/new`)
    } else {
      res.redirect(`/providers/${req.params.providerId}/users`)
    }
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

exports.new_upload_get = (req, res) => {
  const provider = Providers.findOne(req.params.providerId)
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
    error.text = 'Enter the first names, last names and email addresses of the users you want to add'
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

    // set a simple array of emails so we can work out the position of the user in the flow
    // req.session.data.upload.emailList = parseEmailsToList(req.session.data.upload.users)

    // set a new array where we'll put the parsed users
    if (req.session.data.users === undefined) {
      req.session.data.users = []
    }

    // set up the position counter
    if (req.session.data.upload.position === undefined) {
      req.session.data.upload.position = 0
    }

    res.redirect(`/providers/${req.params.providerId}/users/upload/permissions`)
  }
}

exports.new_upload_permissions_get = (req, res) => {
  const provider = Providers.findOne(req.params.providerId)
  const uploadedUsers = req.session.data.upload.users
  const user = uploadedUsers[req.session.data.upload.position]

  res.render('../views/providers/users/upload/permissions', {
    provider,
    user
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
    res.render('../views/providers/users/upload/permissions', {
      provider,
      user,
      errors
    })
  } else {
    // add the user details to the users array for later saving
    req.session.data.users.push(req.session.data.user)

    // delete the user object read for the next item in the flow
    delete req.session.data.user

    // if we've reached the last person, move to the next step, else next continue
    if (req.session.data.upload.position == (req.session.data.upload.users.length - 1)) {
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
  req.flash('success', `${req.session.data.upload.users.length} users added`)
  delete req.session.data.upload
  delete req.session.data.users
  res.redirect(`/providers/${req.params.providerId}/users`)
}

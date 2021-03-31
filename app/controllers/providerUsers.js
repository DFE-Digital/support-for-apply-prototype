const Providers = require('../models/providers')
const Users = require('../models/users')

const ValidationHelper = require('../helpers/validators')

exports.list_get = (req, res) => {
  const provider = Providers.findById(req.params.providerId)
  const users = Users.findByProviderId(req.params.providerId)
  const message = req.flash()
  res.render('../views/providers/users/index', {
    provider,
    users,
    message
  })
}

exports.show_get = (req, res) => {
  const provider = Providers.findById(req.params.providerId)
  const user = Users.findById(req.params.providerId, req.params.userId)

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
  const provider = Providers.findById(req.params.providerId)
  const user = Users.findById(req.params.providerId, req.params.userId)

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
  const provider = Providers.findById(req.params.providerId)
  // const user = Users.findById(req.params.providerId, req.params.userId)
  const errors = []

  if (errors.length) {
    res.render('../views/providers/users/edit', {
      provider,
      user,
      errors
    })
  } else {
    Users.findByIdAndUpdate(req.params.userId, req.session.data.user)
    req.flash('success', `User ‘${req.session.data.user.first_name} ${req.session.data.user.last_name}’ updated`)
    delete req.session.data.user
    res.redirect(`/providers/${req.params.providerId}/users`)
  }
}

exports.new_get = (req, res) => {
  const provider = Providers.findById(req.params.providerId)
  const message = req.flash()
  res.render('../views/providers/users/new', {
    provider,
    message
  })
}

exports.new_post = (req, res) => {
  const provider = Providers.findById(req.params.providerId)

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
    res.render('../views/providers/users/new', {
      provider,
      errors
    })
  } else {
    Users.save(req.params.providerId, req.session.data.user)
    req.flash('success', `New user ‘${req.session.data.user.first_name} ${req.session.data.user.last_name}’ added`)
    delete req.session.data.user
    if (req.session.data.button.submit == 'continue') {
      res.redirect(`/providers/${req.params.providerId}/users/new`)
    } else {
      res.redirect(`/providers/${req.params.providerId}/users`)
    }
  }
}

exports.delete_get = (req, res) => {
  const provider = Providers.findById(req.params.providerId)
  const user = Users.findById(req.params.providerId, req.params.userId)
  res.render('../views/providers/users/delete', {
    provider,
    user
  })
}

exports.delete_post = (req, res) => {
  const user = Users.findById(req.params.providerId, req.params.userId)
  req.flash('success', `User ‘${user.first_name} ${user.last_name}’ deleted`)
  Users.findByIdAndDelete(req.params.userId)
  res.redirect(`/providers/${req.params.providerId}/users`)
}

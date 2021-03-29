const Providers = require('../models/providers')
const Users = require('../models/users')

exports.list_get = (req, res) => {
  const provider = Providers.findById(req.params.providerId)
  const users = Users.findByProviderId(req.params.providerId)

  res.render('../views/providers/users/index', {
    provider,
    users
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

exports.new_get = (req, res) => {
  const provider = Providers.findById(req.params.providerId)

  res.render('../views/providers/users/new', {
    provider
  })
}

exports.new_post = (req, res) => {
  const provider = Providers.findById(req.params.providerId)

  const errors = []

  if (!req.session.data.first_name.length) {
    const error = {}
    error.fieldName = 'first_name'
    error.href = '#first_name'
    error.text = 'Enter a first name'
    errors.push(error)
  }

  if (!req.session.data.last_name.length) {
    const error = {}
    error.fieldName = 'last_name'
    error.href = '#last_name'
    error.text = 'Enter an last name'
    errors.push(error)
  }

  if (!req.session.data.email_address.length) {
    const error = {}
    error.fieldName = 'email_address'
    error.href = '#email_address'
    error.text = 'Enter an email address'
    errors.push(error)
  }

  if (errors.length) {
    res.render('../views/providers/users/new', {
      provider,
      errors
    })
  } else {
    res.redirect(`/providers/${req.params.providerId}/users`)
  }
}

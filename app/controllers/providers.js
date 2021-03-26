const Providers = require('../models/providers')
const Applications = require('../models/applications')
const Courses = require('../models/courses')
const Users = require('../models/users')
const PaginationHelper = require('../helpers/pagination')

exports.list = (req, res) => {

  if (req.session.data.filters === undefined) {
    req.session.data.filters = {}
    req.session.data.filters.onboardingStage = []
    req.session.data.filters.providerType = []
    req.session.data.filters.ratifiedBy = []
  }

  let providers = Providers.find(req.session.data.filters)

  // Get the pagination data
  const pagination = PaginationHelper.getPagination(providers, req.query.page)

  // Get a slice of the data to display
  providers = PaginationHelper.getDataByPage(providers, pagination.pageNumber)

  res.render('../views/providers/list', {
    providers,
    pagination
  })
}

exports.show = (req, res) => {
  const provider = Providers.findById(req.params.providerId)

  res.render('../views/providers/show', {
    provider
  })
}

exports.applicationsList = (req, res) => {
  const provider = Providers.findById(req.params.providerId)

  let applications = Applications.find(req.params.providerId, req.session.data.filters)

  // Get the pagination data
  const pagination = PaginationHelper.getPagination(applications, req.query.page)

  // Get a slice of the data to display
  applications = PaginationHelper.getDataByPage(applications, pagination.pageNumber)

  res.render('../views/providers/applications/list', {
    provider,
    applications,
    pagination
  })
}

exports.usersList = (req, res) => {
  const provider = Providers.findById(req.params.providerId)

  let users = Users.find(req.params.providerId, req.session.data.filters)

  // Get the pagination data
  const pagination = PaginationHelper.getPagination(users, req.query.page)

  // Get a slice of the data to display
  users = PaginationHelper.getDataByPage(users, pagination.pageNumber)

  res.render('../views/providers/users/list', {
    provider,
    users,
    pagination
  })
}

exports.coursesList = (req, res) => {
  const provider = Providers.findById(req.params.providerId)

  let courses = Courses.find(req.params.providerId, req.session.data.filters)

  // Get the pagination data
  const pagination = PaginationHelper.getPagination(courses, req.query.page)

  // Get a slice of the data to display
  courses = PaginationHelper.getDataByPage(courses, pagination.pageNumber)

  res.render('../views/providers/courses/list', {
    provider,
    courses,
    pagination
  })
}

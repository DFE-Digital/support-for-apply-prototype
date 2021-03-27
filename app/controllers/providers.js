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

exports.applicationDetails = (req, res) => {
  const provider = Providers.findById(req.params.providerId)

  res.render('../views/providers/applications/show', {
    provider
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

exports.userDetails = (req, res) => {
  const provider = Providers.findById(req.params.providerId)

  res.render('../views/providers/users/show', {
    provider
  })
}

exports.coursesList = (req, res) => {
  const provider = Providers.findById(req.params.providerId)

  let courses = Courses.find(req.params.providerId, req.session.data.filters)

  courses = courses.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })

  const years = [2019,2020,2021]
  let cycles = []

  years.forEach((item, i) => {
    const cycle = {}
    cycle.year = item
    cycle.courses = courses.filter(c => c.recruitment_cycle_year === item)
    cycles.push(cycle)
  })

  cycles.sort((a, b) => {
    return b.year - a.year
  })

  res.render('../views/providers/courses/list', {
    provider,
    cycles
  })
}

exports.courseDetails = (req, res) => {
  const provider = Providers.findById(req.params.providerId)
  const course = Courses.findById(req.params.providerId, req.params.courseId)

  res.render('../views/providers/courses/show', {
    provider,
    course
  })
}

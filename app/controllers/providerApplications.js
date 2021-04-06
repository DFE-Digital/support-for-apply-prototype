const Providers = require('../models/providers')
const Applications = require('../models/applications')
const PaginationHelper = require('../helpers/pagination')

exports.list_get = (req, res) => {
  const provider = Providers.findOne(req.params.providerId)

  let applications = Applications.find(req.params.providerId, req.session.data.filters)

  // Get the pagination data
  const pagination = PaginationHelper.getPagination(applications, req.query.page)

  // Get a slice of the data to display
  applications = PaginationHelper.getDataByPage(applications, pagination.pageNumber)

  res.render('../views/providers/applications/index', {
    provider,
    applications,
    pagination
  })
}

exports.show_get = (req, res) => {
  const provider = Providers.findOne(req.params.providerId)

  res.render('../views/providers/applications/show', {
    provider
  })
}

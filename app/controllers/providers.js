const Providers = require('../models/providers')
const PaginationHelper = require('../helpers/pagination')

exports.list_get = (req, res) => {

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

  res.render('../views/providers/index', {
    providers,
    pagination
  })
}

exports.show_get = (req, res) => {
  const provider = Providers.findOne(req.params.providerId)

  res.render('../views/providers/show', {
    provider
  })
}

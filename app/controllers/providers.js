const Providers = require('../models/providers')
const PaginationHelper = require('../helpers/pagination')

exports.list = (req, res) => {

  let providers = Providers.find()

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

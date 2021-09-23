const Performance = require('../models/performance')
const PaginationHelper = require('../helpers/pagination')

exports.show_get = (req, res) => {

  res.render('../views/performance/show', {

  })

}

exports.show_service_get = (req, res) => {

  res.render('../views/performance/service/show', {
    cycle: req.params.cycle
  })

}

exports.show_reasons_for_rejection_get = (req, res) => {
  const counts = Performance.getRejectionCounts()

  res.render('../views/performance/reasons-for-rejection/show', {
    counts,
    cycle: req.params.cycle
  })

}

exports.show_reasons_for_rejection_reason_get = (req, res) => {
  let rejections = Performance.findRejections({
    category: req.params.category,
    reason: req.params.reason
  })

  const itemsPerPage = 25

  // Get the pagination data
  const pagination = PaginationHelper.getPagination(rejections, req.query.page, itemsPerPage)

  // Get a slice of the data to display
  rejections = PaginationHelper.getDataByPage(rejections, pagination.pageNumber, itemsPerPage)

  res.render('../views/performance/reasons-for-rejection/list', {
    category: req.params.category,
    reason: req.params.reason,
    rejections,
    pagination
  })

}

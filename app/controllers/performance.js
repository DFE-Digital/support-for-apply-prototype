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

  res.render('../views/performance/reasons-for-rejection/show', {
    cycle: req.params.cycle
  })

}

exports.show_reasons_for_rejection_reason_get = (req, res) => {
  let rejections = Performance.findRejections({reason: req.params.reason})

  // Get the pagination data
  const pagination = PaginationHelper.getPagination(rejections, req.query.page, 25)

  // Get a slice of the data to display
  rejections = PaginationHelper.getDataByPage(rejections, pagination.pageNumber, 25)
console.log(pagination);
  res.render('../views/performance/reasons-for-rejection/list', {
    reason: req.params.reason,
    rejections,
    pagination
  })

}

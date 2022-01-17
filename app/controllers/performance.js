const CycleHelper = require('../helpers/cycles')
const Performance = require('../models/performance')
const PaginationHelper = require('../helpers/pagination')

// TODO: make this dynamic along with report data
const currentCycle = 2021

exports.show_get = (req, res) => {
  res.render('../views/performance/show', {
    currentCycle
  })
}

exports.show_service_get = (req, res) => {
  let currentYear
  let fromYear

  if (req.params.cycle) {
    currentYear = req.params.cycle
    fromYear = req.params.cycle - 1
  } else {
    currentYear = req.session.data.currentCycle.code
    fromYear = currentYear - 3
  }

  res.render('../views/performance/service/show', {
    cycle: req.params.cycle,
    toCycle: CycleHelper.getCycle(currentYear),
    fromCycle: CycleHelper.getCycle(fromYear),
    performanceData: Performance.getPerformanceData(req.params.cycle)
  })

}

exports.show_reasons_for_rejection_get = (req, res) => {
  const cycle = req.params.cycle ? parseInt(req.params.cycle) : CURRENT_CYCLE

  const counts = Performance.getRejectionCounts({
    cycle
  })

  res.render('../views/performance/reasons-for-rejection/show', {
    counts,
    cycle,
    currentCycle
  })

}

exports.show_reasons_for_rejection_reason_get = (req, res) => {
  const cycle = req.params.cycle ? parseInt(req.params.cycle) : CURRENT_CYCLE

  let rejections = Performance.findRejections({
    cycle,
    category: req.params.category,
    reason: req.params.reason
  })

  const itemsPerPage = 25

  // Get the pagination data
  const pagination = PaginationHelper.getPagination(rejections, req.query.page, itemsPerPage)

  // Get a slice of the data to display
  rejections = PaginationHelper.getDataByPage(rejections, pagination.pageNumber, itemsPerPage)

  res.render('../views/performance/reasons-for-rejection/list', {
    cycle,
    currentCycle,
    category: req.params.category,
    reason: req.params.reason,
    rejections,
    pagination
  })

}

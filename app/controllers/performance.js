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

  res.render('../views/performance/reasons-for-rejection/reason', {
    reason: req.params.reason
  })

}

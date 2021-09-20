exports.show_get = (req, res) => {

  res.render('../views/performance/show', {

  })

}

exports.show_service_get = (req, res) => {

  res.render('../views/performance/service/show', {
    cycle: req.params.cycle
  })

}

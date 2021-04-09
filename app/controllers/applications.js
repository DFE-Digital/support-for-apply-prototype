const Applications = require('../models/applications')

exports.list_get = (req, res) => {

  // let applications = Applications.find()

  res.render('../views/applications/list', {
    // applications
  })

}

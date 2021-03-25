const Applications = require('../models/applications')

exports.list = (req, res) => {
  
  // let applications = Applications.find()
  
  res.render('../views/applications/list', {
    // applications
  })
  
}
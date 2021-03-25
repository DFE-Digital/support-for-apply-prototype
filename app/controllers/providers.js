const Providers = require('../models/providers')

exports.list = (req, res) => {
  
  // let providers = Providers.find()
  
  res.render('../views/providers/list', {
    // providers
  })
  
}
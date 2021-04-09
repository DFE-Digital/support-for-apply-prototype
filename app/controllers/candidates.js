const Candidates = require('../models/candidates')

exports.list_get = (req, res) => {

  // let candidates = Candidates.find()

  res.render('../views/candidates/list', {
    // candidates
  })

}

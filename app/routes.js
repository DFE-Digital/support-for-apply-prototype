const express = require('express')
const router = express.Router()

// Controller modules
const authenticationController = require('./controllers/authentication.js')
const applicationController = require('./controllers/applications.js')
const candidateController = require('./controllers/candidates.js')
const providerController = require('./controllers/providers.js')

function checkIsAuthenticated(req, res, next) {
  // if (req.session.passport || req.session.data.user) {
  //   req.session.data.user = req.session.passport.user
    next()
  // } else {
  //   res.redirect('/sign-in')
  // }
}

/// --------------------------------------------------///
/// AUTHENTICATION ROUTES
/// --------------------------------------------------///

router.get('/sign-in', authenticationController.sign_in_get)
// router.post('/sign-in', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/sign-in', failureFlash: 'Missing credentials' }))
router.get('/sign-out', authenticationController.sign_out_get)

/// --------------------------------------------------///
/// APPLICATION ROUTES
/// --------------------------------------------------///

router.get('/applications', checkIsAuthenticated, applicationController.list)



/// --------------------------------------------------///
/// CANDIDATE ROUTES
/// --------------------------------------------------///

router.get('/candidates', checkIsAuthenticated, candidateController.list)



/// --------------------------------------------------///
/// PROVIDER ROUTES
/// --------------------------------------------------///

router.get('/providers/:providerId', checkIsAuthenticated, providerController.show)

router.get('/providers', checkIsAuthenticated, providerController.list)




// Add your routes here - above the module.exports line

module.exports = router

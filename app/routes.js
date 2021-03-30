const express = require('express')
const router = express.Router()

// Controller modules
const authenticationController = require('./controllers/authentication.js')
const applicationController = require('./controllers/applications.js')
const candidateController = require('./controllers/candidates.js')
const providerController = require('./controllers/providers.js')
const providerUserController = require('./controllers/providerUsers.js')
const userController = require('./controllers/users.js')

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

router.get('/providers/:providerId/applications', checkIsAuthenticated, providerController.applicationsList)
// router.post('/providers/:providerId/applications', checkIsAuthenticated, providerController.applicationsList)

router.get('/providers/:providerId/users/:userId/edit', checkIsAuthenticated, providerUserController.edit_get)
router.post('/providers/:providerId/users/:userId/edit', checkIsAuthenticated, providerUserController.edit_post)

router.get('/providers/:providerId/users/:userId/delete', checkIsAuthenticated, providerUserController.delete_get)
router.post('/providers/:providerId/users/:userId/delete', checkIsAuthenticated, providerUserController.delete_post)

router.get('/providers/:providerId/users/new', checkIsAuthenticated, providerUserController.new_get)
router.post('/providers/:providerId/users/new', checkIsAuthenticated, providerUserController.new_post)

router.get('/providers/:providerId/users/:userId', checkIsAuthenticated, providerUserController.show_get)

router.get('/providers/:providerId/users', checkIsAuthenticated, providerUserController.list_get)

router.get('/providers/:providerId/courses/:courseId', checkIsAuthenticated, providerController.courseDetails)

router.get('/providers/:providerId/courses', checkIsAuthenticated, providerController.coursesList)
// router.post('/providers/:providerId/courses', checkIsAuthenticated, providerController.coursesList)

router.get('/providers/:providerId', checkIsAuthenticated, providerController.show)

router.get('/providers', checkIsAuthenticated, providerController.list)
router.post('/providers', checkIsAuthenticated, providerController.list)


/// --------------------------------------------------///
/// USER ROUTES
/// --------------------------------------------------///

router.get('/users', checkIsAuthenticated, userController.list)


// Add your routes here - above the module.exports line

module.exports = router

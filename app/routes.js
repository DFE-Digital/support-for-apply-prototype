const express = require('express')
const router = express.Router()

// Controller modules
const authenticationController = require('./controllers/authentication.js')
const applicationController = require('./controllers/applications.js')
const candidateController = require('./controllers/candidates.js')
const providerController = require('./controllers/providers.js')
const providerApplicationController = require('./controllers/providerApplications.js')
const providerCourseController = require('./controllers/providerCourses.js')
const providerUserController = require('./controllers/providerUsers.js')
const userController = require('./controllers/users.js')
const performanceController = require('./controllers/performance.js')

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

router.get('/applications', checkIsAuthenticated, applicationController.list_get)



/// --------------------------------------------------///
/// CANDIDATE ROUTES
/// --------------------------------------------------///

router.get('/candidates', checkIsAuthenticated, candidateController.list_get)



/// --------------------------------------------------///
/// PROVIDER ROUTES
/// --------------------------------------------------///

router.get('/providers/:providerId/applications', checkIsAuthenticated, providerApplicationController.list_get)
// router.post('/providers/:providerId/applications', checkIsAuthenticated, providerApplicationController.list_post)

router.get('/providers/:providerId/users/upload', checkIsAuthenticated, providerUserController.new_upload_get)
router.post('/providers/:providerId/users/upload', checkIsAuthenticated, providerUserController.new_upload_post)

router.get('/providers/:providerId/users/upload/permissions', checkIsAuthenticated, providerUserController.new_upload_permissions_get)
router.post('/providers/:providerId/users/upload/permissions', checkIsAuthenticated, providerUserController.new_upload_permissions_post)

router.get('/providers/:providerId/users/upload/check', checkIsAuthenticated, providerUserController.new_upload_check_get)
router.post('/providers/:providerId/users/upload/check', checkIsAuthenticated, providerUserController.new_upload_check_post)

router.get('/providers/:providerId/users/:userId/history', checkIsAuthenticated, providerUserController.history_get)

router.get('/providers/:providerId/users/:userId/edit', checkIsAuthenticated, providerUserController.edit_get)
router.post('/providers/:providerId/users/:userId/edit', checkIsAuthenticated, providerUserController.edit_post)

router.get('/providers/:providerId/users/:userId/permissions', checkIsAuthenticated, providerUserController.edit_permissions_get)
router.post('/providers/:providerId/users/:userId/permissions', checkIsAuthenticated, providerUserController.edit_permissions_post)

router.get('/providers/:providerId/users/:userId/delete', checkIsAuthenticated, providerUserController.delete_get)
router.post('/providers/:providerId/users/:userId/delete', checkIsAuthenticated, providerUserController.delete_post)

router.get('/providers/:providerId/users/new', checkIsAuthenticated, providerUserController.new_get)
router.post('/providers/:providerId/users/new', checkIsAuthenticated, providerUserController.new_post)

router.get('/providers/:providerId/users/:userId', checkIsAuthenticated, providerUserController.show_get)

router.get('/providers/:providerId/users', checkIsAuthenticated, providerUserController.list_get)

router.get('/providers/:providerId/courses/:courseId', checkIsAuthenticated, providerCourseController.show_get)

router.get('/providers/:providerId/courses', checkIsAuthenticated, providerCourseController.list_get)
// router.post('/providers/:providerId/courses', checkIsAuthenticated, providerController.list_post)

router.get('/providers/:providerId', checkIsAuthenticated, providerController.show_get)

router.get('/providers', checkIsAuthenticated, providerController.list_get)
// router.post('/providers', checkIsAuthenticated, providerController.list_post)


/// --------------------------------------------------///
/// USER ROUTES
/// --------------------------------------------------///

router.get('/users', checkIsAuthenticated, userController.list)


/// --------------------------------------------------///
/// PERFORMANCE ROUTES
/// --------------------------------------------------///

router.get('/performance/service/:cycle', checkIsAuthenticated, performanceController.show_service_get)

router.get('/performance/service', checkIsAuthenticated, performanceController.show_service_get)

router.get('/performance/reasons-for-rejection/cycle/:cycle', checkIsAuthenticated, performanceController.show_reasons_for_rejection_get)

router.get('/performance/reasons-for-rejection/:category/:reason', checkIsAuthenticated, performanceController.show_reasons_for_rejection_reason_get)

router.get('/performance/reasons-for-rejection/:category', checkIsAuthenticated, performanceController.show_reasons_for_rejection_reason_get)

router.get('/performance/reasons-for-rejection', checkIsAuthenticated, performanceController.show_reasons_for_rejection_get)

router.get('/performance', checkIsAuthenticated, performanceController.show_get)

// Add your routes here - above the module.exports line

module.exports = router

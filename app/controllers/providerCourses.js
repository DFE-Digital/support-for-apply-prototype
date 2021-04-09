const Providers = require('../models/providers')
const Courses = require('../models/courses')

exports.list_get = (req, res) => {
  const provider = Providers.findOne(req.params.providerId)

  let courses = Courses.find(req.params.providerId, req.session.data.filters)

  courses = courses.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })

  const years = [2019,2020,2021]
  let cycles = []

  years.forEach((item, i) => {
    const cycle = {}
    cycle.year = item
    cycle.courses = courses.filter(c => c.recruitment_cycle_year === item)
    cycles.push(cycle)
  })

  cycles.sort((a, b) => {
    return b.year - a.year
  })

  res.render('../views/providers/courses/index', {
    provider,
    cycles
  })
}

exports.show_get = (req, res) => {
  const provider = Providers.findOne(req.params.providerId)
  const course = Courses.findOne(req.params.providerId, req.params.courseId)

  if (course) {
    res.render('../views/providers/courses/show', {
      provider,
      course
    })
  } else {
    res.redirect(`/providers/${req.params.providerId}/courses`)
  }
}

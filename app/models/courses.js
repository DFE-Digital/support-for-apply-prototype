const path = require('path')
const fs = require('fs')

const directoryPath = path.join(__dirname, '../data/')

exports.save = (data) => {

}

exports.find = (providerId = null, data) => {
  const filePath = directoryPath + '/courses.json';

  const rawData = fs.readFileSync(filePath)

  let courses = JSON.parse(rawData)

  if (providerId !== null) {
    courses = courses.filter(c => c.provider.code === providerId)
  }

  if (data !== undefined) {



  }

  return courses
}

exports.findById = (providerId, courseId) => {
  const courses = this.find(providerId)
  const course = courses.filter(c => c.code == courseId)
  return course[0]
}

exports.findByIdAndUpdate = (id, data) => {

}

exports.findByIdAndDelete = (id) => {

}

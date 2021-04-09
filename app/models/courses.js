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
    courses = courses.filter(c => c.provider.code === providerId.toUpperCase())
  }

  if (data !== undefined) {



  }

  return courses
}

exports.findOne = (providerId, courseId) => {
  const courses = this.find(providerId)
  const course = courses.filter(c => c.code == courseId.toUpperCase())
  return course[0]
}

exports.insertOne = (data) => {

}

exports.insertMany = (data) => {

}

exports.updateOne = (id, data) => {

}

exports.updateMany = (data) => {

}

exports.deleteOne = (id) => {

}

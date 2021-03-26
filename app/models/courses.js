const path = require('path')
const fs = require('fs')

const directoryPath = path.join(__dirname, '../data/')

exports.save = (data) => {

}

exports.find = (id = null, data) => {
  const filePath = directoryPath + '/courses.json';

  const rawData = fs.readFileSync(filePath)

  let courses = JSON.parse(rawData)

  if (id !== null) {
    courses = courses.filter(c => c.provider.code === id)
  }

  if (data !== undefined) {



  }

  return courses
}

exports.findById = (id) => {

}

exports.findByIdAndUpdate = (id, data) => {

}

exports.findByIdAndDelete = (id) => {

}

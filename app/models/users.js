const path = require('path')
const fs = require('fs')

const directoryPath = path.join(__dirname, '../data/')

exports.save = (data) => {

}

exports.find = (id, data) => {
  const filePath = directoryPath + '/users.json';

  const rawData = fs.readFileSync(filePath)
  let courses = JSON.parse(rawData)

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

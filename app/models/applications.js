const path = require('path')
const fs = require('fs')

const directoryPath = path.join(__dirname, '../data/')

exports.save = (data) => {

}

exports.find = (id, data) => {
  const filePath = directoryPath + '/applications.json';

  const rawData = fs.readFileSync(filePath)
  let applications = JSON.parse(rawData)

  if (data !== undefined) {



  }

  return applications
}

exports.findById = (id) => {

}

exports.findByIdAndUpdate = (id, data) => {

}

exports.findByIdAndDelete = (id) => {

}

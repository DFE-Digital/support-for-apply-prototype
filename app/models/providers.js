const path = require('path')
const fs = require('fs')

const directoryPath = path.join(__dirname, '../data/')

exports.save = (data) => {

}

exports.find = () => {
  const filePath = directoryPath + '/providers.json';

  const rawData = fs.readFileSync(filePath)
  const providerData = JSON.parse(rawData)

  return providerData
}

exports.findById = (id) => {
  const providers = this.find()
  const provider = providers.filter(p => p.code == id)
  return provider[0]
}

exports.findByIdAndUpdate = (id, data) => {

}

exports.findByIdAndDelete = (id) => {

}

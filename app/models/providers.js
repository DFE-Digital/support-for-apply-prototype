const path = require('path')
const fs = require('fs')

const directoryPath = path.join(__dirname, '../data/')

exports.save = (data) => {

}

exports.find = (data) => {
  const filePath = directoryPath + '/providers.json';

  const rawData = fs.readFileSync(filePath)
  let providers = JSON.parse(rawData)

  if (data !== undefined) {

    if (data.onboardingStage.includes('With synced courses')) {
      providers = providers.filter(p => p.sync_courses === true)
    }

    if (data.onboardingStage.includes('With signed DSA')) {
      providers = providers.filter(p => p.agreement.signed_dsa === true)
    }

    if (data.providerType.includes('School Direct')) {
      providers = providers.filter(p => p.provider_type === 'lead_school')
    }

    if (data.providerType.includes('SCITT')) {
      providers = providers.filter(p => p.provider_type === 'scitt')
    }

    if (data.providerType.includes('HEI')) {
      providers = providers.filter(p => p.provider_type === 'university')
    }

  }

  return providers
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

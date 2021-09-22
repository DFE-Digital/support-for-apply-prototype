const path = require('path')
const fs = require('fs')

const directoryPath = path.join(__dirname, '../data/reasons-for-rejection/')

const writeFileSync = (data) => {
  const raw = JSON.stringify(data)

  const fileName = data.id + '.json'
  const filePath = directoryPath + '/' + fileName

  // write the JSON data
  fs.writeFileSync(filePath, raw)
}


exports.findRejections = (data) => {
  let documents = fs.readdirSync(directoryPath,'utf8')

  // Only get JSON documents
  documents = documents.filter(doc => doc.match(/.*\.(json)/ig))

  let rejections = []

  documents.forEach((filename, i) => {
    const raw = fs.readFileSync(directoryPath + '/' + filename)
    const rejection = JSON.parse(raw)
    rejections.push(rejection)
  })

  // Sort rejections by date
  rejections = rejections.sort((a, b) => {
    return b.rejected_at.localeCompare(a.rejected_at)
  })

  if (data !== undefined) {

    if (data.reason.length) {

      switch (data.reason) {
        case 'candidate-behaviour':
          return rejections.filter(rejection => rejection.something_you_did === true)
          break
        case 'cannot-sponsor-visa':
          return rejections.filter(rejection => rejection.visa_application_sponsorship === true)
          break
        case 'course-full':
          return rejections.filter(rejection => rejection.course_full === true)
          break
        case 'honesty-and-professionalism':
          return rejections.filter(rejection => rejection.honesty_and_professionalism === true)
          break
        case 'offered-another-course':
          return rejections.filter(rejection => rejection.they_offered_you_a_place_on_another_course === true)
          break
        case 'other-advice-or-feedback':
          return rejections.filter(rejection => rejection.additional_advice === true)
          break
        case 'performance-at-interview':
          return rejections.filter(rejection => rejection.performance_at_interview === true)
          break
        case 'qualifications':
          return rejections.filter(rejection => rejection.qualifications === true)
          break
        case 'quality-of-application':
          return rejections.filter(rejection => rejection.quality_of_application === true)
          break
        case 'safeguarding':
          return rejections.filter(rejection => rejection.safeguarding_issues === true)
          break
        default:
          return rejections
      }
    }
  } else {
    return reasons
  }

}

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

exports.getRejectionCounts = (data) => {
  const rejections = this.findRejections(data)

  return rejections.length
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

  if (data) {

    if (data.category) {
      console.log(data.category);
      switch (data.category) {
        case 'candidate-behaviour':
          rejections = rejections.filter(rejection => rejection.something_you_did === true)
          break
        case 'cannot-sponsor-visa':
          rejections = rejections.filter(rejection => rejection.visa_application_sponsorship === true)
          break
        case 'course-full':
          rejections = rejections.filter(rejection => rejection.course_full === true)
          break
        case 'honesty-and-professionalism':
          rejections = rejections.filter(rejection => rejection.honesty_and_professionalism === true)
          break
        case 'offered-place-on-another-course':
          rejections = rejections.filter(rejection => rejection.they_offered_you_a_place_on_another_course === true)
          break
        case 'other-advice-or-feedback':
          rejections = rejections.filter(rejection => rejection.additional_advice === true)
          break
        case 'performance-at-interview':
          rejections = rejections.filter(rejection => rejection.performance_at_interview === true)
          break
        case 'qualifications':
          rejections = rejections.filter(rejection => rejection.qualifications === true)
          break
        case 'quality-of-application':
          rejections = rejections.filter(rejection => rejection.quality_of_application === true)
          break
        case 'safeguarding':
          rejections = rejections.filter(rejection => rejection.safeguarding_issues === true)
          break
      }
    }

    if (data.reason) {
      console.log(data.reason);
      switch (data.reason) {
        case 'did-not-reply-to-messages':
          rejections = rejections.filter(rejection => rejection.didn_t_reply_to_our_interview_offer === true)
          break
        case 'did-not-attend-interview':
          rejections = rejections.filter(rejection => rejection.didn_t_attend_interview === true)
          break
        case 'personal-statement':
          rejections = rejections.filter(rejection => rejection.personal_statement === true)
          break
        case 'subject-knowledge':
          rejections = rejections.filter(rejection => rejection.subject_knowledge === true)
          break
        case 'no-english-gcse':
          rejections = rejections.filter(rejection => rejection.no_english_gcse_grade_4_c_or_above_or_valid_equivalent === true)
          break
        case 'no-maths-gcse':
          rejections = rejections.filter(rejection => rejection.no_maths_gcse_grade_4_c_or_above_or_valid_equivalent === true)
          break
        case 'no-science-gcse':
          rejections = rejections.filter(rejection => rejection.no_science_gcse_grade_4_c_or_above_or_valid_equivalent_for_primary_applicants === true)
          break
        case 'no-degree':
          rejections = rejections.filter(rejection => rejection.no_degree === true)
          break
        case 'degree-does-not-meet-course-requirements':
          rejections = rejections.filter(rejection => rejection.degree_doesn_t_meet_course_requirements === true)
          break
        case 'innacurate-information':
          rejections = rejections.filter(rejection => rejection.information_given_on_application_form_false_or_inaccurate === true)
          break
        case 'plagiarism':
          rejections = rejections.filter(rejection => rejection.evidence_of_plagiarism_in_personal_statement_or_elsewhere === true)
          break
        case 'references':
          rejections = rejections.filter(rejection => rejection.references_didn_t_support_application === true)
          break
        case 'disclosed-information':
          rejections = rejections.filter(rejection => rejection.information_disclosed_by_candidate_makes_them_unsuitable_to_work_with_children === true)
          break
        case 'vetting-process':
          rejections = rejections.filter(rejection => rejection.information_revealed_by_our_vetting_process_makes_the_candidate_unsuitable_to_work_with_children === true)
          break
      }

      if (data.category && data.reason === 'other') {
        switch (data.category) {
          case 'candidate-behaviour':
            rejections = rejections.filter(rejection => (rejection.something_you_did_other_reason_details !== undefined
              && rejection.something_you_did_other_reason_details.length)
              || rejection.candidate_behaviour_what_to_improve !== undefined
              && rejection.candidate_behaviour_what_to_improve)
            break
          case 'honesty-and-professionalism':
            rejections = rejections.filter(rejection => rejection.honesty_and_professionalism_other_reason_details !== undefined
              && rejection.honesty_and_professionalism_other_reason_details.length)
            break
          case 'qualifications':
            rejections = rejections.filter(rejection => rejection.qualifications_other_reason_details !== undefined
              && rejection.qualifications_other_reason_details.length)
            break
          case 'quality-of-application':
            rejections = rejections.filter(rejection => (rejection.quality_of_application_what_to_improve !== undefined
              && rejection.quality_of_application_what_to_improve.length)
              || rejection.quality_of_application_other_reason_details !== undefined
              && rejection.quality_of_application_other_reason_details)
            break
          case 'safeguarding':
            rejections = rejections.filter(rejection => rejection.safeguarding_issues_other_reason_details !== undefined
              && rejection.safeguarding_issues_other_reason_details.length)
            break
        }
      }

    }

  }

  return rejections

}

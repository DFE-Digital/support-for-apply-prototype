const path = require('path')
const fs = require('fs')
const moment = require('moment')

const directoryPath = path.join(__dirname, '../data/')

const categories = [
  {
    key: 'candidate-behaviour',
    value: 'something_you_did',
    items: [
      {
        key: 'did-not-reply-to-messages',
        value: 'didn_t_reply_to_our_interview_offer'
      },
      {
        key: 'did-not-attend-interview',
        value: 'didn_t_attend_interview'
      },
      {
        key: 'other',
        value: 'something_you_did_other_reason_details'
      }
    ]
  },
  {
    key: 'cannot-sponsor-visa',
    value: 'visa_application_sponsorship'
  },
  {
    key: 'course-full',
    value: 'course_full'
  },
  {
    key: 'honesty-and-professionalism',
    value: 'honesty_and_professionalism',
    items: [
      {
        key: 'innacurate-information',
        value: 'information_given_on_application_form_false_or_inaccurate'
      },
      {
        key: 'plagiarism',
        value: 'evidence_of_plagiarism_in_personal_statement_or_elsewhere'
      },
      {
        key: 'references',
        value: 'references_didn_t_support_application'
      },
      {
        key: 'other',
        value: 'honesty_and_professionalism_other_reason_details'
      }
    ]
  },
  {
    key: 'offered-place-on-another-course',
    value: 'they_offered_you_a_place_on_another_course'
  },
  {
    key: 'other',
    value: 'why_are_you_rejecting_this_application_details'
  },
  {
    key: 'other-advice-or-feedback',
    value: 'additional_advice'
  },
  {
    key: 'performance-at-interview',
    value: 'performance_at_interview'
  },
  {
    key: 'qualifications',
    value: 'qualifications',
    items: [
      {
        key: 'no-english-gcse',
        value: 'no_english_gcse_grade_4_c_or_above_or_valid_equivalent'
      },
      {
        key: 'no-maths-gcse',
        value: 'no_maths_gcse_grade_4_c_or_above_or_valid_equivalent'
      },
      {
        key: 'no-science-gcse',
        value: 'no_science_gcse_grade_4_c_or_above_or_valid_equivalent_for_primary_applicants'
      },
      {
        key: 'no-degree',
        value: 'no_degree'
      },
      {
        key: 'degree-does-not-meet-course-requirements',
        value: 'degree_doesn_t_meet_course_requirements'
      },
      {
        key: 'other',
        value: 'qualifications_other_reason_details'
      }
    ]
  },
  {
    key: 'quality-of-application',
    value: 'quality_of_application',
    items: [
      {
        key: 'personal-statement',
        value: 'personal_statement'
      },
      {
        key: 'subject-knowledge',
        value: 'subject_knowledge'
      },
      {
        key: 'other',
        value: 'quality_of_application_other_reason_details'
      }
    ]
  },
  {
    key: 'safeguarding',
    value: 'safeguarding_issues',
    items: [
      {
        key: 'disclosed-information',
        value: 'information_disclosed_by_candidate_makes_them_unsuitable_to_work_with_children'
      },
      {
        key: 'vetting-process',
        value: 'information_revealed_by_our_vetting_process_makes_the_candidate_unsuitable_to_work_with_children'
      },
      {
        key: 'other',
        value: 'safeguarding_issues_other_reason_details'
      }
    ]
  }
]

exports.getRejectionCounts = (data) => {
  const rejections = this.findRejections(data)

  const counts = {}
  counts.total = rejections.length

  counts.monthTotal = rejections.filter(rejection => rejection.rejected_at >= '2021-09-01'
    && rejection.rejected_at <= '2021-09-30').length

  categories.forEach((category, i) => {
    const parent = {}

    let parentRejections = []

    if (category.key === 'other') {
      parentRejections = rejections.filter(rejection => rejection[category.value] && rejection[category.value].length)
    } else {
      parentRejections = rejections.filter(rejection => rejection[category.value] === true)
    }

    parent.total = parentRejections.length
    parent.percent = (parent.total / counts.total) * 100
    // rejected_at
    parent.monthTotal = parentRejections
                    .filter(rejection => rejection.rejected_at >= '2021-09-01'
                    && rejection.rejected_at <= '2021-09-30').length

    parent.monthPercent = (parent.monthTotal / counts.monthTotal) * 100

    if (category.items) {
      parent.items = {}

      category.items.forEach((item, i) => {
        const child = {}

        let childRejections = []

        if (item.key === 'other') {
          childRejections = rejections.filter(rejection => rejection[item.value] && rejection[item.value].length)
        } else {
          childRejections = rejections.filter(rejection => rejection[item.value] === true)
        }

        child.total = childRejections.length
        child.percent = (child.total / counts.total) * 100

        child.monthTotal = childRejections
                        .filter(rejection => rejection.rejected_at >= '2021-09-01'
                          && rejection.rejected_at <= '2021-09-30').length

        child.monthPercent = (child.monthTotal / parent.monthTotal) * 100

        parent.items[item.key] = child
      })
    }

    counts[category.key] = parent
  })

  return counts
}

exports.findRejections = (data) => {
  // let documents = fs.readdirSync(directoryPath,'utf8')
  //
  // // Only get JSON documents
  // documents = documents.filter(doc => doc.match(/.*\.(json)/ig))
  //
  // let rejections = []
  //
  // documents.forEach((filename, i) => {
  //   const raw = fs.readFileSync(directoryPath + '/' + filename)
  //   const rejection = JSON.parse(raw)
  //   rejections.push(rejection)
  // })

  const raw = fs.readFileSync(directoryPath + '/reasons-for-rejection.json')
  let rejections = JSON.parse(raw)

  // Sort rejections by date
  rejections = rejections.sort((a, b) => {
    return b.rejected_at.localeCompare(a.rejected_at)
  })

  if (data) {

    if (data.category) {
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
        case 'other':
          rejections = rejections.filter(rejection => rejection.why_are_you_rejecting_this_application_details
            && rejection.why_are_you_rejecting_this_application_details.length)
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
              || (rejection.candidate_behaviour_what_to_improve !== undefined
              && rejection.candidate_behaviour_what_to_improve.length))
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
            rejections = rejections.filter(rejection => (rejection.quality_of_application_other_reason_details !== undefined
              && rejection.quality_of_application_other_reason_details)
              || (rejection.quality_of_application_what_to_improve !== undefined
              && rejection.quality_of_application_what_to_improve.length))
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

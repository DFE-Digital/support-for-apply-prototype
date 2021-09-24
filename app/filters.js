const _ = require('lodash')
const moment = require('moment')
const numeral = require('numeral')
moment.suppressDeprecationWarnings = true

module.exports = function (env) {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  const filters = {}

  /* ------------------------------------------------------------------
     date filter for use in Nunjucks
     example: {{ params.date | date("DD/MM/YYYY") }}
     outputs: 01/01/1970
   ------------------------------------------------------------------ */
   filters.date = (timestamp, format) => {
     return moment(timestamp).format(format)
   }

   /* ------------------------------------------------------------------
     dateAdd filter for use in Nunjucks
     example: {{ '1970-01-01' | dateAdd(1, 'weeks') | date("DD/MM/YYYY") }}
     outputs: 08/01/1970
   ------------------------------------------------------------------ */
   filters.dateAdd = (date, num, unit='days') => {
     return moment(date).add(num, unit).toDate()
   }

  /* ------------------------------------------------------------------
    utility functions for use in appDate function/filter
  ------------------------------------------------------------------ */
  filters.govDate = (timestamp) => {
    return moment(timestamp).format('D MMMM YYYY')
  }

  filters.govShortDate = (timestamp) => {
    return moment(timestamp).format('D MMM YYYY')
  }

  filters.govTime = (timestamp) => {
    let t = moment(timestamp)
    if(t.minutes() > 0) {
      return t.format('h:mma')
    } else {
      return t.format('ha')
    }
  }

  filters.appDate = (timestamp, type) => {
    switch(type) {
      case 'datetime':
        return filters.govDate(timestamp) + ' at ' + filters.govTime(timestamp)
      case 'shortdatetime':
        return filters.govShortDate(timestamp) + ' at ' + filters.govTime(timestamp)
      case 'date':
        return filters.govDate(timestamp)
      case 'shortdate':
        return filters.govShortDate(timestamp)
      case 'time':
        return filters.govTime(timestamp)
      default:
        return timestamp
    }
  }

  /* ------------------------------------------------------------------
    utility functions for parsing codes into their string names
  ------------------------------------------------------------------ */
  filters.getFundingTypeName = (code) => {
    switch (code) {
      case 'fee': return 'Fee paying'
      case 'salary': return 'Salary'
      case 'apprencticeship': return 'Apprencticeship'
      default: return code
    }
  }

  filters.getSubjectName = (code) => {
    switch (code) {
      case 'W1': return 'Art and design'
      case 'C1': return 'Biology'
      case '08': return 'Business studies'
      case 'F1': return 'Chemistry'
      case '09': return 'Citizenship'
      case 'Q8': return 'Classics'
      case 'P3': return 'Communications and media studies'
      case '11': return 'Computer science'
      case '12': return 'Dance'
      case 'DT': return 'Design and technology'
      case 'Q3': return 'Drama'
      case 'L1': return 'Economics'
      case '13': return 'English'
      case '16': return 'English as a second or other language'
      case '15': return 'French'
      case 'F8': return 'Geography'
      case '17': return 'German'
      case 'L5': return 'Health and social care'
      case 'V1': return 'History'
      case '18': return 'Italian'
      case '19': return 'Japanese'
      case '20': return 'Mandarin'
      case 'G1': return 'Mathematics'
      case '24': return 'Modern languages (other)'
      case 'W3': return 'Music'
      case 'C6': return 'Physical education'
      case 'F3': return 'Physics'
      case '00': return 'Primary'
      case '01': return 'Primary with English'
      case '02': return 'Primary with geography and history'
      case '03': return 'Primary with mathematics'
      case '04': return 'Primary with modern languages'
      case '06': return 'Primary with physical education'
      case '07': return 'Primary with science'
      case 'C8': return 'Psychology'
      case 'V6': return 'Religious education'
      case '21': return 'Russian'
      case 'F0': return 'Science'
      case '14': return 'Social sciences'
      case '22': return 'Spanish'
      default: code
    }
  }

  filters.getProgramTypeName = (code) => {
    switch (code) {
      case 'HE': return 'Higher education institution'
      case 'SC': return 'SCITT'
      case 'SD': return 'School direct (unsalaried)'
      case 'SS': return 'School direct (salaried)'
      case 'TA': return 'Postgraduate teaching apprenticeship'
      default: return code

    }
  }

  filters.getCourseLengthName = (code) => {

  }

  filters.getStudyModeName = (code) => {
    switch (code) {
      case 'F': return 'Full time'
      case 'P': return 'Part time'
      case 'B': return 'Full time and part time'
      default: return code
    }
  }

  filters.getLevelName = (code) => {
    switch (code) {
      case 'Primary': return 'Primary'
      case 'Secondary': return 'Secondary'
      default: return code
    }
  }

  filters.getAgeRangeName = (code) => {
    switch (code) {
      case '2 to 11': return '2 to 11'
      case '2 to 7': return '2 to 7'
      case '3 to 11': return '3 to 11'
      case '3 to 7': return '3 to 7'
      case '3 to 9': return '3 to 9'
      case '4 to 11': return '4 to 11'
      case '5 to 11': return '5 to 11'
      case '7 to 11': return '7 to 11'
      case '7 to 14': return '7 to 14'
      case '7 to 18': return '7 to 18'
      case '11 to 16': return '11 to 16'
      case '11 to 18': return '11 to 18'
      case '11 to 19': return '11 to 19'
      case '14 to 18': return '14 to 18'
      case '14 to 19': return '14 to 19'
      case '16 to 18': return '16 to 18'
      default: return code
    }
  }

  filters.getQualificationName = (codes) => {
    const array = codes.slice(0)
    const last = array.pop()
    if (codes.length > 1) {
      return array.join(', ').toUpperCase() + ' and ' + last.toUpperCase()
    }
    return last
  }

  filters.getFinancialSupportName = (code) => {
    return 'None'
  }

  filters.getNotificationName = (code) => {
    switch (code) {
      case 'application_received': return 'Application received'
      case 'application_received_from_another_organisation': return 'Application received from another organisation'
      case 'application_rejected_by_default': return 'Application automatically rejected'
      case 'application_withdrawn': return 'Application withdrawn by candidate'
      case 'application_transferred_to_another_organisation': return 'Application transferred to another organisation'
      case 'offer_accepted': return 'Offer accepted'
      case 'offer_declined': return 'Offer rejected'
      default: return code
    }
  }

  /* ------------------------------------------------------------------
    utility function to get an error for a component
    example: {{ errors | getErrorMessage('title') }}
    outputs: "Enter a title"
  ------------------------------------------------------------------ */
  filters.getErrorMessage = function (array, fieldName) {
    if (!array || !fieldName) {
      return null
    }

    const error = array.filter((obj) =>
      obj.fieldName === fieldName
    )[0]

    return error
  }

  /* ------------------------------------------------------------------
  utility function to return true or false
  example: {{ 'yes' | falsify }}
  outputs: true
  ------------------------------------------------------------------ */
  filters.falsify = (input) => {
    if (_.isNumber(input)) {
      return input
    } else if (input == false) {
      return false
    }

    if (_.isString(input)) {
      const truthyValues = ['yes','true']
      const falsyValues = ['no','false']
      if (truthyValues.includes(input.toLowerCase())) {
        return true
      } else if (falsyValues.includes(input.toLowerCase())) {
        return false
      }
    }

    return input
  }

  /* ------------------------------------------------------------------
  utility function to return yes or no
  example: {{ 'true' | yesNo }}
  outputs: Yes
  ------------------------------------------------------------------ */
  filters.yesNo = (input) => {
    const truthyValues = ['yes','true',true,1]
    const falsyValues = ['no','false',false,0]

    if (truthyValues.includes(input)) {
      return 'yes'
    } else if (falsyValues.includes(input)) {
      return 'no'
    }

    return input
  }

  /*
  ====================================================================
  arrayToGovukTable
  --------------------------------------------------------------------
  Convert an array to form needed for govukTable macro
  ====================================================================

  Expects array or nested array.

  Usage:

  {% set tableData = [
    ["1 January", "Friday", "New Year’s Day"],
    ["2 April", "Friday", "Good Friday"],
    ["5 April", "Monday", "Easter Monday"]
    ]
  %}

  {{ govukTable({
    caption: "2021 Bank holidays",
    firstCellIsHeader: true,
    head: [
      {
        text: "Date"
      },
      {
        text: "Day of week"
      },
      {
        text: "Holiday name"
      }
    ],
    rows: tableData | arrayToGovukTable
  }) }}

  */

  filters.arrayToGovukTable = (array) => {
    // Coerce to nested array
    array = (Array.isArray(array[0])) ? array : [array]
    const tableData = []
    array.forEach(row => {
      const rowData = []
      row.forEach(item => {
        rowData.push({
          html: item // html for flexibility
        })
      })
      tableData.push(rowData)
    })
    // tableData = (tableData.length === 1) ? tableData[0] : tableData
    return tableData
  }

  /* ------------------------------------------------------------------
  utility function to return reason for rejection category label
  example: {{ 'candidate-behaviour' | getRejectionCategoryLabel }}
  outputs: Candidate behaviour
  ------------------------------------------------------------------ */
  filters.getRejectionCategoryLabel = (code) => {
    switch (code) {
      case 'candidate-behaviour': return 'Candidate behaviour'
      case 'cannot-sponsor-visa': return 'Cannot sponsor applicants visa'
      case 'course-full': return 'Course full'
      case 'honesty-and-professionalism': return 'Honesty and professionalism'
      case 'offered-place-on-another-course': return 'Offered place on another course'
      case 'other': return 'Other feedback'
      case 'other-advice-or-feedback': return 'Additional advice or feedback'
      case 'performance-at-interview': return 'Performance at interview'
      case 'qualifications': return 'Qualifications'
      case 'quality-of-application': return 'Quality of application'
      case 'safeguarding': return 'Safeguarding'
      default: return code
    }
  }

  /* ------------------------------------------------------------------
  utility function to return reason for rejection resaon label
  example: {{ 'no-english-gcse' | getRejectionReasonLabel }}
  outputs: No English GCSE grade 4 (C) or above, or accepted equivalent
  ------------------------------------------------------------------ */
  filters.getRejectionReasonLabel = (code) => {
    switch (code) {
      case 'did-not-reply-to-messages': return 'Did not reply to messages'
      case 'did-not-attend-interview': return 'Did not attend interview'
      case 'personal-statement': return 'Personal statement'
      case 'subject-knowledge': return 'Subject knowledge'
      case 'no-english-gcse': return 'No English GCSE grade 4 (C) or above, or accepted equivalent'
      case 'no-maths-gcse': return 'No maths GCSE grade 4 (C) or above, or accepted equivalent'
      case 'no-science-gcse': return 'No science GCSE grade 4 (C) or above, or accepted equivalent (for primary applicants)'
      case 'no-degree': return 'No degree'
      case 'degree-does-not-meet-course-requirements': return 'Degree does not meet course requirements'
      case 'innacurate-information': return 'Innacurate or false information in the application'
      case 'plagiarism': return 'Evidence of plagiarism in the application'
      case 'references': return 'References did not support the application'
      case 'disclosed-information': return 'The candidate disclosed information which makes them unsuitable to work with children'
      case 'vetting-process': return 'The vetting process found information which makes the candidate unsuitable to work with children'
      case 'other': return 'Other'
      default: return code
    }
  }

  /* ------------------------------------------------------------------
   numeral filter for use in Nunjucks
   example: {{ params.number | numeral("0,00.0") }}
   outputs: 1,000.00
  ------------------------------------------------------------------ */
  filters.numeral = (number, format) => {
   return numeral(number).format(format)
  }

  /* ------------------------------------------------------------------
  utility function to remove empty elements from an array
  example: {{ ['','','AB1','BC2'] | removeEmptyElements }}
  returns: ['AB1','BC2']
  ------------------------------------------------------------------ */
  filters.removeEmptyElements = (array) => {
    return filtered = array.filter((el) => {
      return el !== ''
    })
  }

  /* ------------------------------------------------------------------
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */
  return filters
}

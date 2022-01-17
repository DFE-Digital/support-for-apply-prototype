const _ = require('lodash')
const { DateTime } = require('luxon')
const numeral = require('numeral')

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
   filters.date = (timestamp, format = 'yyyy-LL-dd') => {
     let datetime = DateTime.fromJSDate(timestamp, {
       locale: 'en-GB'
     }).toFormat(format)

     if (datetime === 'Invalid DateTime') {
       datetime = DateTime.fromISO(timestamp, {
         locale: 'en-GB'
       }).toFormat(format)
     }

     return datetime
   }

   /* ------------------------------------------------------------------
     dateAdd filter for use in Nunjucks
     example: {{ '1970-01-01' | dateAdd(1, 'weeks') | date("DD/MM/YYYY") }}
     outputs: 08/01/1970
   ------------------------------------------------------------------ */
   filters.dateAdd = (timestamp, num, unit='days') => {
      let date
      switch (unit) {
        case 'minutes':
          date = DateTime.fromJSDate(timestamp).plus({ minutes: num })
          break
        case 'hours':
          date = DateTime.fromJSDate(timestamp).plus({ hours: num })
          break
        case 'days':
          date = DateTime.fromJSDate(timestamp).plus({ days: num })
          break
        default:
        date = timestamp
      }
      return date.toJSDate()
    }

  /* ------------------------------------------------------------------
    utility functions for use in appDate function/filter
  ------------------------------------------------------------------ */
  filters.govDate = (timestamp) => {
    return filters.date(timestamp, 'd MMMM yyyy')
  }

  filters.govShortDate = (timestamp) => {
    return filters.date(timestamp, 'd MMM yyyy')
  }

  filters.govTime = (timestamp) => {
    const time = DateTime.fromJSDate(timestamp)
    if(time.minute > 0) {
      return filters.date(timestamp, 'h:mma')
    } else {
      return filters.date(timestamp, 'ha')
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
  filters.getCycleLabel = (code) => {
    let label = ''
    switch (code.toString()) {
      case '2022':
        label = '2021 to 2022'
        break
      case '2021':
        label = '2020 to 2021'
        break
      case '2020':
        label = '2019 to 2020'
        break
      default:
        label = code
    }
    return label
  }

  filters.getFundingTypeLabel = (code) => {
    let label = ''
    switch (code.toUpperCase()) {
      case 'FEE':
        label = 'Fee paying'
        break
      case 'SALARY':
        label = 'Salary'
        break
      case 'APPRENCTICESHIP':
        label = 'Apprencticeship'
        break
      default:
        label = code
    }
    return label
  }

  filters.getSubjectLabel = (code) => {
    let label = ''
    switch (code.toUpperCase()) {
      case 'W1':
        label = 'Art and design'
        break
      case 'C1':
        label = 'Biology'
        break
      case '08':
        label = 'Business studies'
        break
      case 'F1':
        label = 'Chemistry'
        break
      case '09':
        label = 'Citizenship'
        break
      case 'Q8':
        label = 'Classics'
        break
      case 'P3':
        label = 'Communications and media studies'
        break
      case '11':
        label = 'Computer science'
        break
      case '12':
        label = 'Dance'
        break
      case 'DT':
        label = 'Design and technology'
        break
      case 'Q3':
        label = 'Drama'
        break
      case 'L1':
        label = 'Economics'
        break
      case '13':
        label = 'English'
        break
      case '16':
        label = 'English as a second or other language'
        break
      case '15':
        label = 'French'
        break
      case 'F8':
        label = 'Geography'
        break
      case '17':
        label = 'German'
        break
      case 'L5':
        label = 'Health and social care'
        break
      case 'V1':
        label = 'History'
        break
      case '18':
        label = 'Italian'
        break
      case '19':
        label = 'Japanese'
        break
      case '20':
        label = 'Mandarin'
        break
      case 'G1':
        label = 'Mathematics'
        break
      case '24':
        label = 'Modern languages (other)'
        break
      case 'W3':
        label = 'Music'
        break
      case 'C6':
        label = 'Physical education'
        break
      case 'F3':
        label = 'Physics'
        break
      case '00':
        label = 'Primary'
        break
      case '01':
        label = 'Primary with English'
        break
      case '02':
        label = 'Primary with geography and history'
        break
      case '03':
        label = 'Primary with mathematics'
        break
      case '04':
        label = 'Primary with modern languages'
        break
      case '06':
        label = 'Primary with physical education'
        break
      case '07':
        label = 'Primary with science'
        break
      case 'C8':
        label = 'Psychology'
        break
      case 'V6':
        label = 'Religious education'
        break
      case '21':
        label = 'Russian'
        break
      case 'F0':
        label = 'Science'
        break
      case '14':
        label = 'Social sciences'
        break
      case '22':
        label = 'Spanish'
        break
      default:
        label = code
    }
    return label
  }

  filters.getProgramTypeLabel = (code) => {
    let label = ''
    switch (code.toUpperCase()) {
      case 'HE':
        label = 'Higher education institution'
        break
      case 'SC':
        label = 'SCITT'
        break
      case 'SD':
        label = 'School direct (unsalaried)'
        break
      case 'SS':
        label = 'School direct (salaried)'
        break
      case 'TA':
        label = 'Postgraduate teaching apprenticeship'
        break
      default:
        label = code
    }
    return label
  }

  filters.getCourseLengthLabel = (code) => {
    let label = ''

    return label
  }

  filters.getStudyModeLabel = (code) => {
    let label = ''
    switch (code.toUpperCase()) {
      case 'F':
        label = 'Full time'
        break
      case 'P':
        label = 'Part time'
        break
      case 'B':
        label = 'Full time and part time'
        break
      default:
        label = code
    }
    return label
  }

  filters.getLevelLabel = (code) => {
    let label = ''
    switch (code.toUpperCase()) {
      case 'PRIMARY':
        label = 'Primary'
        break
      case 'SECONDARY':
        label = 'Secondary'
        break
      case 'FURTHER_EDUCATION':
        label = 'Further education'
        break
      default:
        label = code
    }
    return label
  }

  filters.getAgeRangeLabel = (code) => {
    let label = ''
    switch (code) {
      case '2 to 11':
        label = '2 to 11'
        break
      case '2 to 7':
        label = '2 to 7'
        break
      case '3 to 11':
        label = '3 to 11'
        break
      case '3 to 7':
        label = '3 to 7'
        break
      case '3 to 9':
        label = '3 to 9'
        break
      case '4 to 11':
        label = '4 to 11'
        break
      case '5 to 11':
        label = '5 to 11'
        break
      case '7 to 11':
        label = '7 to 11'
        break
      case '7 to 14':
        label = '7 to 14'
        break
      case '7 to 18':
        label = '7 to 18'
        break
      case '11 to 16':
        label = '11 to 16'
        break
      case '11 to 18':
        label = '11 to 18'
        break
      case '11 to 19':
        label = '11 to 19'
        break
      case '14 to 18':
        label = '14 to 18'
        break
      case '14 to 19':
        label = '14 to 19'
        break
      case '16 to 18':
        label = '16 to 18'
        break
      default:
        label = code
    }
    return label
  }

  filters.getQualificationLabel = (codes) => {
    const array = codes.slice(0)
    const last = array.pop()
    if (codes.length > 1) {
      return array.join(', ').toUpperCase() + ' and ' + last.toUpperCase()
    }
    return last
  }

  filters.getFinancialSupportLabel = (code) => {
    return 'None'
  }

  filters.getNotificationLabel = (code) => {
    let label = ''
    switch (code.toUpperCase()) {
      case 'APPLICATION_RECEIVED':
        label = 'Application received'
        break
      case 'APPLICATION_RECEIVED_FROM_ANOTHER_ORGANISATION':
        label = 'Application received from another organisation'
        break
      case 'APPLICATION_REJECTED_BY_DEFAULT':
        label = 'Application automatically rejected'
        break
      case 'APPLICATION_WITHDRAWN':
        label = 'Application withdrawn by candidate'
        break
      case 'APPLICATION_TRANSFERRED_TO_ANOTHER_ORGANISATION':
        label = 'Application transferred to another organisation'
        break
      case 'OFFER_ACCEPTED':
        label = 'Offer accepted'
        break
      case 'OFFER_DECLINED':
        label = 'Offer rejected'
        break
      default:
        label = code
    }
    return label
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
    let label = ''
    switch (code) {
      case 'candidate-behaviour':
        label = 'Candidate behaviour'
        break
      case 'cannot-sponsor-visa':
        label = 'Cannot sponsor visa'
        break
      case 'course-full':
        label = 'Course full'
        break
      case 'honesty-and-professionalism':
        label = 'Honesty and professionalism'
        break
      case 'offered-place-on-another-course':
        label = 'Offered place on another course'
        break
      case 'other':
        label = 'Other reasons'
        break
      case 'additional-advice-or-feedback':
        label = 'Additional advice or feedback'
        break
      case 'performance-at-interview':
        label = 'Performance at interview'
        break
      case 'qualifications':
        label = 'Qualifications'
        break
      case 'quality-of-application':
        label = 'Quality of application'
        break
      case 'safeguarding':
        label = 'Safeguarding'
        break
      default:
        label = code
    }
    return label
  }

  /* ------------------------------------------------------------------
  utility function to return reason for rejection resaon label
  example: {{ 'no-english-gcse' | getRejectionReasonLabel }}
  outputs: No English GCSE grade 4 (C) or above, or accepted equivalent
  ------------------------------------------------------------------ */
  filters.getRejectionReasonLabel = (code) => {
    let label = ''
    switch (code) {
      case 'did-not-reply-to-messages':
        label = 'Did not reply to messages'
        break
      case 'did-not-attend-interview':
        label = 'Did not attend interview'
        break
      case 'personal-statement':
        label = 'Personal statement'
        break
      case 'subject-knowledge':
        label = 'Subject knowledge'
        break
      case 'no-english-gcse':
        label = 'No English GCSE grade 4 (C) or above, or accepted equivalent'
        break
      case 'no-maths-gcse':
        label = 'No maths GCSE grade 4 (C) or above, or accepted equivalent'
        break
      case 'no-science-gcse':
        label = 'No science GCSE grade 4 (C) or above, or accepted equivalent (for primary applicants)'
        break
      case 'no-degree':
        label = 'No degree'
        break
      case 'degree-does-not-meet-course-requirements':
        label = 'Degree does not meet course requirements'
        break
      case 'innacurate-information':
        label = 'Innacurate or false information in the application'
        break
      case 'plagiarism':
        label = 'Evidence of plagiarism in the application'
        break
      case 'references':
        label = 'References did not support the application'
        break
      case 'disclosed-information':
        label = 'The candidate disclosed information which makes them unsuitable to work with children'
        break
      case 'vetting-process':
        label = 'The vetting process found information which makes the candidate unsuitable to work with children'
        break
      case 'other':
        label = 'Other'
        break
      default:
        label = code
    }
    return label
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

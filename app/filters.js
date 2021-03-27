const moment = require('moment')
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
      default: code
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
      default: code
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

  /* ------------------------------------------------------------------
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */
  return filters
}

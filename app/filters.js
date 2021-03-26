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
    utility functions for use in mojDate function/filter
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
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */
  return filters
}

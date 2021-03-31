exports.isDefined = (value) => {
  let valid = true
  if(!value || value === undefined) {
    valid = false
  }
  return valid
}

exports.isEmpty = (value) => {
  let valid = true
  if(!value || value.trim().length == 0) {
    valid = false
  }
  return valid
}

exports.isValidEmail = (email) => {
  const regex = /^(([^<>()\[\]\\.,:\s@"]+(\.[^<>()\[\]\\.,:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  let valid = true
  if (!email || !regex.test(email)) {
    valid = false
  }
  return valid
}

exports.isValidUrl = (url) => {
  const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,=.]+$/igm
  let valid = true
  if (!url || !regex.test(url)) {
    valid = false
  }
  return valid
}

exports.isValidUuid = (uuid) => {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  let valid = true
  if (!uuid || !regex.test(uuid)) {
    valid = false
  }
  return valid
}

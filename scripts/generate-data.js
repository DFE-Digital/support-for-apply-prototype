const  fs = require('fs')
const path = require('path')

const sourceData = path.join(__dirname, '../app/data/seed')
const destinationData = path.join(__dirname, '../app/data')

const copy = (source, destination) => {
  let results = []
  const list = fs.readdirSync(source)
  let sourceFile, destinationFile

  list.forEach((file) => {
    sourceFile = source + '/' + file
    destinationFile = destination + '/' + file

    const stat = fs.statSync(sourceFile)
    if (stat && stat.isDirectory()) {
      try {
        console.log('Creating directory: ' + destinationFile)
        fs.mkdirSync(destinationFile)
      } catch(e) {
        console.log('Directory already exists: ' + destinationFile)
      }
      results = results.concat(copy(sourceFile, destinationFile))
    } else {
      try {
        console.log('Copying file: ' + destinationFile)
        fs.writeFileSync(destinationFile, fs.readFileSync(sourceFile))
      } catch(e) {
        console.log('Could’t copy file: ' + destinationFile)
      }
      results.push(sourceFile)
    }
  })
  return results
}

copy(sourceData, destinationData)

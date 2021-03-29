const fs = require('fs')
const path = require('path')

const source = path.join(__dirname, '../app/data/defaults/')
const destination = path.join(__dirname, '../app/data/')

let files = fs.readdirSync(source,'utf8')

// Only get JSON documents
files = files.filter( doc => doc.match(/.*\.(json)/ig))

files.forEach((file, i) => {
  fs.copyFile((source + file), (destination + file), (err) => {
    if (err) throw err;
    console.log(file + ' was copied to destination');
  })
})

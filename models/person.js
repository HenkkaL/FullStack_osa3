const mongoose = require('mongoose')

if ( process.env.NODE_ENV !== 'production' ) {
    console.log(process.env.NODE_ENV)
    require('dotenv').config()
}
console.log(process.env.MONGODB_URI)
const url = process.env.MONGODB_URI

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

module.exports = Person
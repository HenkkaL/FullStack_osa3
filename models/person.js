const mongoose = require('mongoose')

const url = 'mongodb://@ds129540.mlab.com:29540/osa3'

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

module.exports = Person
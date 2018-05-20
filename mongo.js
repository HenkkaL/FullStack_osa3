const mongoose = require('mongoose')

const url = 'mongodb://****************@ds129540.mlab.com:29540/osa3'

mongoose.connect(url)

const Person = mongoose.model('Person', {
    name: String,
    number: String
})

if (process.argv[2] && process.argv[3]) {
    const name = process.argv[2]
    const number = process.argv[3]
    console.log(`Lisätään henkilö ${name} numero ${number} `)

    
    const person = new Person ({
        name: name,
        number: number
    })
    
    person
        .save()
        .then(responce => {
            mongoose.connection.close()
    })
} 
else {
    Person
        .find({})
        .then(result => {
            result.forEach( item => {
                console.log(item)
            })
            mongoose.connection.close()
        })
        
}

const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('content', function getId (req) {
    return JSON.stringify(req.body)
  })

const app = express()
app.use(express.static('build'))
app.use(cors())
app.use(morgan(':method :url :content :status :res[content-length] - :response-time ms'))
app.use(bodyParser.json())

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
      },
      {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
      },
      {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
      }
]

const formatPerson = (person) => {
    return {
        id: person._id,
        name: person.name,
        number: person.number
    }
}

app.get('/info', (req, res) => {
    res.send(
        `<p>Puhelinluettelossa on ${persons.length} henkilön tiedot</p>
        <h3>${new Date()}</h3>`
    )
})

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.json(persons.map(formatPerson))
        })
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if(person) {
        res.json(person)
    } else {
        res.status(404).end()
    }    
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if (body.name === undefined || body.name === '') {
        return res.status(400).json({error: 'name missing'});        
    }
    if (body.number === undefined || body.number === '') {
        return res.status(400).json({error: 'number missing'});        
    }
    console.log('testi2')

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person
        .save()
        .then(savedPerson => {
            res.json(formatPerson(savedPerson))
        })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)    
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

app.put('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const updatedPerson = req.body

    persons = persons.map(person => person.id === id? updatedPerson : person)

    res.json(updatedPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
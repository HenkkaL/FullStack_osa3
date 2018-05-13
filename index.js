const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

morgan.token('content', function getId (req) {
    return JSON.stringify(req.body)
  })

const app = express()
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

app.get('/info', (req, res) => {
    res.send(
        `<p>Puhelinluettelossa on ${persons.length} henkilön tiedot</p>
        <h3>${new Date()}</h3>`
    )
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
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
    const person = req.body
    if (!person.number)
        return res.status(400).json({error: `missing number`})
    if (!person.name)
        return res.status(400).json({error: `missing name`})
    if (persons.find(item => item.name === person.name ))
        return res.status(400).json({error: `Name must be unique`})
    person.id = Math.floor(Math.random() * Math.floor(100000))
    
    persons = persons.concat(person)

    res.json(person)
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
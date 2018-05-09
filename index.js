const express = require('express')
const app = express()
const bodyParser = require('body-parser')

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
    if (persons.find(person => person.name === person.name ))
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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
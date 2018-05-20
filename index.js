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
    Person
    .find({})
    .then(persons => {
        res.send(
            `<p>Puhelinluettelossa on ${persons.length} henkilön tiedot</p>
            <h3>${new Date()}</h3>`
        )
    })

})

app.get('/api/persons', (req, res) => {
    Person
        .find({})
        .then(persons => {
            res.json(persons.map(formatPerson))
        })
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    Person
    .findById(id)
    .then(person => {
        res.json(formatPerson(person))
    })
    .catch(error => {
        console.log(error)
        response.status(404).end()
    })
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    if (body.name === undefined || body.name === '') {
        return res.status(400).json({error: 'name missing'});        
    }
    if (body.number === undefined || body.number === '') {
        return res.status(400).json({error: 'number missing'});        
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    Person
        .find({name: body.name})
        .then(result => {
            if(result.length === 0) {
                person
                .save()
                .then(savedPerson => {
                    res.json(formatPerson(savedPerson))
                })                
            }
            else
                return res.status(400).json({error: 'duplicate name'}); 
        })


})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id    
    Person.findByIdAndRemove(id, (err, todo) => {
        if(err) {
            return res.status(500).send(err)
        }
            
        const responce = {
            message: 'Deleted successfully',
            id: todo._id
        }
        return res.status(200).send(responce)
    })
})

app.put('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const updatedPerson = req.body

    Person
        .findByIdAndUpdate(id, updatedPerson, {new: true}, (err, todo) => {
        if (err){
            console.log(err)
            return res.status(500).send(err);
        }
        })
        .then(updatedPerson => {
            res.json(formatPerson(updatedPerson))
        })

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
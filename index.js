const express = require('express')
const morgan = require('morgan')
const path = require('path')

const app = express()

app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

// GET all persons
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// INFO
app.get('/info', (request, response) => {
  const peopleCount = persons.length
  const date = new Date()

  response.send(`
    <p>Phonebook has info for ${peopleCount} people</p>
    <p>${date}</p>
  `)
})

// GET person by id
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id

  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

// DELETE person
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id

  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

// Generate random id
const generateId = () => {
  return String(Math.floor(Math.random() * 1000000))
}

// POST person
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const nameExists = persons.some(
    person => person.name === body.name
  )

  if (nameExists) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons.push(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
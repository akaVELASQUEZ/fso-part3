const express = require('express')
const app = express()
var morgan = require('morgan')


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())

app.use(morgan(function (tokens, req, res) {
    const jsonBody = JSON.stringify(req.body)
    console.log(req)
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      jsonBody,

    ].join(' ')
  })
)

const generateID = () => {
    const randomID = Math.floor(Math.random() * 100000)
    return randomID
}


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(`Phonebook has info for ${persons.length} people
    <br/>
    ${Date()}`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    
    if (person) {
        res.json(person)
    }
    else {
        res.status(404).end()
    }
})


app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    console.log(persons)

    res.status(204).end()
})


app.post('/api/persons', (req, res) => {
    const body = req.body
    
    const person = {
        "id": generateID(),
        "name": body.name,
        "number": body.number
    }

    const nameCheck = persons.find(p => p.name === body.name)

    if (body.name && body.number) {
        if (nameCheck) {
            res.status(404).json({
                error: "Name already exists"
            })
        }
        else {
            persons = persons.concat(person)
            res.json(person)
        }
    }
    else {
        res.status(404).json({
            error: "Please fill all the fields"
        })
    }
})
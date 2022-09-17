const express = require('express')
const mongoose = require('mongoose')
const app = express()
require('dotenv').config();
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person');
const { response } = require('express');


app.use(express.static('build'))
app.use(cors())

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

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`)
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        res.json(people)
      })
})

app.get('/info', (req, res) => {
    Person.count((err, count) => {
        res.send(`Phonebook has info for ${count} people
        <br/>
        ${Date()}`)
    })
})
    

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person) {
                res.json(person)
            }
            else {
                res.status(404).end()
            }
        })
        .catch(error => next(error))
})


app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
        res.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
  
    const person = {
        name: body.name,
        number: body.number
    }
  
    Person.findByIdAndUpdate(req.params.id, person, { new: true })
      .then(updatedPerson => {
        res.json(updatedPerson)
      })
      .catch(error => next(error))
})


app.post('/api/persons', (req, res) => {
    const body = req.body
    const person = new Person({
        "name": body.name,
        "number": body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })     
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
}

app.use(errorHandler)
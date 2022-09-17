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

// const generateID = () => {
//     const randomID = Math.floor(Math.random() * 100000)
//     return randomID
// }

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
    res.send(`Phonebook has info for ${persons.length} people
    <br/>
    ${Date()}`)
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id)
        .then(person =>{
            res.json(person)
        })

    // const id = Number(req.params.id)
    // const person = persons.find(p => p.id === id)
    
    // if (person) {
    //     res.json(person)
    // }
    // else {
    //     res.status(404).end()
    // }
})


app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)
    console.log(persons)

    res.status(204).end()
})


app.post('/api/persons', (req, res) => {
    const body = req.body
    
    // if (body.content === undefined) {
    //     return res.status(400).json({ error: 'content missing' })
    // }

    const person = new Person({
        "name": body.name,
        "number": body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })

    // const nameCheck = persons.find(p => p.name === body.name)

    // if (body.name && body.number) {
    //     if (nameCheck) {
    //         res.status(404).json({
    //             error: "Name already exists"
    //         })
    //     }
    //     else {
    //         persons = persons.concat(person)
    //         res.json(person)
    //     }
    // }
    // else {
    //     res.status(404).json({
    //         error: "Please fill all the fields"
    //     })
    // }        
})
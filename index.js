const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')
const app = express()
app.use(express.json()) 
app.use(cors())
app.use(express.static('build'))




morgan.token('person', (req) =>{
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }else {
    return null
  }
})

app.use(
  morgan(':method :url :status :res[content-length] :response-time ms :entry')
)


/*let persons = [ 
    {    
    id: 1,    
    name: "Arto Hellas",  
    number: "040-123456" },  
    
    {    
    id: 2,    
    name: "Ada Lovelace",    
    number: "39-44-5323523"    
     },  
    
    {    
    id: 3,    
    name: "Dan Abromov",    
    number: "12+43+234345"
  },

    {
     id: 4,
     name:"Mary Poppendick",
     number:"39-236423122"   
    }]*/
    
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})
      
app.get('/api/persons', (req, res) => {
  Person.find({}).then((item) => {
    res.json(item)
  })
})

app.get('/info', (req,res) =>{
  Person.countDocuments({}).then((count) => {
    const infoContent = `Phonebook has info for ${count} people<br>${Date()}`
    res.send(infoContent)
  })
})
 

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Person.findById(id)
    .then((person) => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch((error) => next(error))
  })

app.delete('/api/persons/:id', (req, res, next) => {
        const id = Number(req.params.id)
        persons = persons.filter(person => person.id !== id)
        res.status(204).end()
        .catch((error) => next(error))
          })

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    const person = {
          name: body.name,
          number: body.number,
        }
      
        Person.findByIdAndUpdate(req.params.id, person, { new: true })
          .then(updatedPerson => {
            res.json(updatedPerson)
          })
          .catch(error => next(error))
      })

app.post('/api/persons', (req, res, next) => {
  const body = req.body
        if (body.name === undefined) {
          return res.status(400).json({ error: 'name is missing!' })
        }
        if (body.number === undefined) {
          return res.status(400).json({ error: 'number is missing!' })
        }
        const person = new Person ({
          id: Math.floor(Math.random() * 100),
          name: body.name,
          number: body.number
        })
        person.save().then(savedPerson => {
          res.json(savedPerson.toJSON())
        })
          .catch(error => next(error))
      })

const PORT = process.env.Port || 3001
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})

const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
} 
else if (process.argv.length != 3 && process.argv.length != 5) {
  console.log('Please execute a proper input.')
  process.exit(1)
}
else {
  const password = process.argv[2]

  const url = `mongodb+srv://fullstack:${password}@cluster0.uares7u.mongodb.net/PhonebookApp?retryWrites=true&w=majority`

  const personSchema = new mongoose.Schema({
    name: String,
    number: Number
  })

  const Person = mongoose.model('Person', personSchema)

  if (process.argv.length == 5) {
    mongoose
    .connect(url)
    .then((result) => {

        const person = new Person({
          name: process.argv[3],
          number: process.argv[4]
        })
    
        return person.save()
    })
    .then(() => {
      console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
  } 
  else if (process.argv.length == 3) {
    mongoose
    .connect(url)
    .then((result) => {

      Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person)
        })
        mongoose.connection.close()
      })
    })
  }
}

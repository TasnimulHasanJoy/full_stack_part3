require('dotenv').config()

const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

if (process.argv.length < 4) {
  console.log('Usage: node mongo.js "Name" "Number"')
  process.exit(1)
}

const url = process.env.MONGODB_URI

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[2],
  number: process.argv[3],
})

person.save().then(() => {
  console.log(`Added ${person.name} ${person.number}`)
  mongoose.connection.close()
})
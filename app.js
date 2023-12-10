const express = require('express');
const dotenv = require('dotenv');
dotenv.config()

const mongoose = require('mongoose')

// mongoose.connect(process.env.MONGO_URL, {
//   dbName: process.env.MONGO_DBNAME
// })
//   .then(() => {
//     console.log('Database connected')
//   })
//   .catch((e) => {
//     console.log('Database not connected due to error, ', e)
//   })

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))

const PORT = process.env.SERVER_PORT || 9000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

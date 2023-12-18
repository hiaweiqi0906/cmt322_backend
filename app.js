const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config()

const appointmentRoutes = require('./routes/appointmentRoutes');

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
app.use(cors())

const PORT = process.env.SERVER_PORT || 9000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})


// Appointment routes
app.use('/appointments', appointmentRoutes);

// app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
dotenv.config();
const getUserInfo = require('./helpers/getUserInfo');
const jwt = require('jsonwebtoken');

const appointment = require('./routes/appointment');
const cases = require('./routes/case');
const document = require('./routes/document');
const auth = require('./routes/auth');
const statistic = require('./routes/statistic');
let messageBatch = {};
let collectedUserInfo = {};
const mongoose = require('mongoose');
const Message = require('./models/message')
const User = require('./models/user')

const crmRoute = require('./routes/crm');

mongoose.connect(process.env.MONGO_URL, {
  dbName: process.env.MONGO_DBNAME,
})
  .then(() => {
    console.log('Database connected');
  })
  .catch((e) => {
    console.log('Database not connected due to error, ', e);
  });

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));



const PORT = process.env.SERVER_PORT || 9000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
// All routes
app.use('/api/appointments', appointment);
app.use('/api/documents', document);
app.use('/api/cases', cases);
app.use('/api/statistics', statistic);
app.use('/auth', auth);
app.use('/api/crm', crmRoute);

const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
});

io.use(function (socket, next) {
  if (socket.handshake.query && socket.handshake.query.token) {
    jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) return next(new Error('Authentication error'));
      socket.decoded = decoded;
      next();
    });
  }
  else {
    next(new Error('Authentication error'));
  }
}).on('connection', (socket) => {
  // Handling joining a case room
  socket.on('joinRoom', (caseId) => {
    socket.join(caseId);
    console.log(`User joined room: ${caseId}`);
  });

  // Handling chat messages
  socket.on('chatMessage', async (data) => {
    // Broadcast the message to everyone in the case room
    const currentUserId = socket.decoded.userId
    if (!collectedUserInfo[currentUserId]) {
      collectedUserInfo[currentUserId] = await User.findById(new mongoose.Types.ObjectId(currentUserId))
    }

    console.log(collectedUserInfo);
    io.to(data.caseId).emit('message', data)
    const messagebody = {
      message_sender_id: currentUserId,
      message_sender_name: collectedUserInfo[currentUserId].username,
      message_sender_avatar: collectedUserInfo[currentUserId].avatar_url,
      message_type: data.type,
      message: data.message,
      message_sent_date: (Date.now())
    }
    if (!messageBatch[data.caseId]) {
      messageBatch[data.caseId] = [messagebody]
    } else {
      messageBatch[data.caseId].push(messagebody)
    }

    console.log(messageBatch);
  });

  // Handling disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Write the message batch to MongoDB
const writeMessageBatchToDB = () => {
  if (Object.keys(messageBatch).length > 0) {
    console.log(messageBatch);
    // Insert the batch into the MongoDB collection
    // Message.insertMany(messageBatch)
    //   .then(() => {
    //     console.log('Batch written to MongoDB');
    //     // Clear the batch after writing
    //     messageBatch.length = 0;
    //   })
    //   .catch((err) => {
    //     console.error('Error writing batch to MongoDB:', err);
    //   });

    // // const filter = 
    for (const cid of Object.keys(messageBatch)) {
      const messageEachCase = messageBatch[cid]
      const filter = {
        "message_case_id": cid,
      }
      const newMessages = Message.findOneAndUpdate(filter, {
        "$push":
        {
          "message_list": [...messageEachCase]
        }
      }, { new: true, upsert: true }).then(() => {
        console.log('Batch written to MongoDB');
        // Clear the batch after writing
        messageBatch = {};
      })
        .catch((err) => {
          console.error('Error writing batch to MongoDB:', err);
        });
    }

  }
}

// Set up periodic batch write (adjust the interval as needed)
setInterval(writeMessageBatchToDB, 5000); // 5000 milliseconds (5 seconds) as an example interval

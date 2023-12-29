const { DataNotExistError } = require('../helpers/exceptions');
const getUserInfo = require('../helpers/getUserInfo');
const Appointment = require('../models/appointment');
const User = require('../models/user');

const appointmentList = [
  {
    _id: '1',
    creator: 'Jie Yi',
    title: 'Appointment 1',
    attendees: [
      {
        name: 'Bulbasaur',
        response: 'pending'
      },
      {
        name: 'Charmander',
        response: 'pending'
      },
      {
        name: 'Pikachu',
        response: 'declined'
      }
    ],
    location: 'USM',
    dateStart: '2024-1-1',
    dateEnd: '2024-1-1',
    timeStart: '3:30 PM',
    timeEnd: '4:00 PM',
    details: 'The appointment 1 is scheduled',
    status: 'scheduled'
  },
  {
    _id: '2',
    creator: 'Pikachu',
    title: 'Appointment 2',
    attendees: [
      {
        name: 'Suikun',
        response: 'accepted'
      },
      {
        name: 'Bulbasaur',
        response: 'declined'
      }
    ],
    location: 'UTM',
    dateStart: '2023-12-28',
    dateEnd: '2023-12-28',
    timeStart: '',
    timeEnd: '',
    details: 'The appointment 2 is scheduled',
    status: 'scheduled'
  },
  {
    _id: '3',
    creator: 'John',
    title: 'Appointment 3',
    attendees: [
      {
        name: 'Johnson',
        response: 'pending'
      }
    ],
    location: 'UKM',
    dateStart: '2023-12-29',
    dateEnd: '2023-12-29',
    timeStart: '8:00 AM',
    timeEnd: '9:00 AM',
    details: 'The appointment 3 is scheduled',
    status: 'cancelled'
  },
  {
    _id: '4',
    creator: 'Charmeleon',
    title: 'Appointment 4',
    attendees: [
      {
        name: 'Pikachu',
        response: 'pending'
      }
    ],
    location: 'UKM',
    dateStart: '2023-12-29',
    dateEnd: '2023-12-29',
    timeStart: '8:00 AM',
    timeEnd: '9:00 AM',
    details: 'The appointment 4 is scheduled',
    status: 'scheduled'
  },
  {
    _id: '5',
    creator: 'Raikou',
    title: 'Appointment 5',
    attendees: [
      {
        name: 'Pikachu',
        response: 'pending'
      }
    ],
    location: 'UKM',
    dateStart: '2023-12-29',
    dateEnd: '2023-12-29',
    timeStart: '8:00 AM',
    timeEnd: '9:00 AM',
    details: 'The appointment 5 is scheduled',
    status: 'scheduled'
  },
  {
    _id: '6',
    creator: 'Entei',
    title: 'Appointment 6',
    attendees: [
      {
        name: 'Pikachu',
        response: 'accepted'
      }
    ],
    location: 'UKM',
    dateStart: '2024-1-4',
    dateEnd: '2024-1-4',
    timeStart: '9:00 AM',
    timeEnd: '10:00 AM',
    details: 'The appointment 6 is scheduled',
    status: 'scheduled'
  },

]

const attendees = ['Bulbasaur', 'Ivysaur', 'Venusaur', 'Charmander', 'Charmeleon', 'Pikachu', 'Raikou', 'Suikun', 'Entei']
// let role = 'admin';
// let username = 'Pikachu';

// Filter the appointments based on username
const filterAppointments = (allAppointments, username) => {
  const appointments = allAppointments.filter(appointment =>
    (appointment.creator === username ||    // If the user is creator or attendee of an appointment
    appointment.attendees.some(attendee => attendee.name === username)) && // And
    appointment.status === 'scheduled'      // If the appointment is scheduled (not cancelled)
  );

  return appointments;
}


// To retrieve all appointments from database
const retrieveAllAppointments = async () => {
  try {
    // Use the find method to retrieve all appointments
    const allAppointments = await Appointment.find({});

    return allAppointments;
  } catch (error) {
    throw new Error(`Error retrieving appointments: ${error.message}`);
  }
};


// To retrieve the appointment based on id from database
const retrieveAppointmentByID = async (appointmentID) => {
  try {
    // Use the findById method to retrieve the appointment by _id
    const appointment = await Appointment.findById(appointmentID);

    if (!appointment) {
      throw new Error('Appointment not found');
    }

    return appointment;
  } catch (error) {
    throw new Error(`Error retrieving specific appointment: ${error.message}`);
  }
}


// Update the appointment object in the database
const updateAppointmentById = async (appointmentId, updatedAppointmentData) => {
  try {
    // Use the updateOne method to replace the appointment based on _id
    const result = await Appointment.updateOne(
      { _id: appointmentId },
      { $set: updatedAppointmentData }
    );

    if (result.nModified === 0) {
      throw new Error('Appointment not found or no modifications were made');
    }

    //return result;
  } catch (error) {
    throw new Error(`Error updating appointment: ${error.message}`);
  }
};


// Update the appointment object's status property only in the database
const updateAppointmentStatusById = async (appointmentId, newStatus) => {
  try {
    const result = await Appointment.updateOne(
      { _id: appointmentId },
      { $set: { status: newStatus } }
    );

    if (result.nModified === 0) {
      throw new Error('Appointment not found or no modifications were made');
    }

    // No need to return the result object if it's not used elsewhere
  } catch (error) {
    throw new Error(`Error updating appointment status: ${error.message}`);
  }
};


// Update the appointemnt object's attendee response only in the database
const updateAttendeeResponse = async (appointmentId, attendeeName, newResponse) => {
  try {
    const result = await Appointment.updateOne(
      { _id: appointmentId, 'attendees.name': attendeeName },
      { $set: { 'attendees.$.response': newResponse } }
    );

    if (result.nModified === 0) {
      throw new Error('Appointment not found or no modifications were made');
    }

    // No need to return the result object if it's not used elsewhere
  } catch (error) {
    throw new Error(`Error updating attendee response: ${error.message}`);
  }
};


// To retrieve all username except 1 user
const retrieveAllUsersExceptCurrentUser = async (excludeName) => {
  try {
    // Use the find method to retrieve all user names excluding the specified name
    const allUsers = await User.find({ username: { $ne: excludeName } }, 'username');

    // Extract the names from the result
    const userNames = allUsers.map(user => user.username);

    return userNames;
  } catch (error) {
    throw new Error(`Error retrieving user names: ${error.message}`);
  }
}


// Check the user is admin? return the response
const checkUserType = (req, res) => {
  const { type } = getUserInfo(res);    // Get the user type from cookies token

  if(type == 'admin')
    res.send(true);
  else  
    res.send(false);
}


// To send the appointments to the user
const getAppointments = async (req, res) => {

  try {

    const { name, type } = getUserInfo(res);  // Get the user's name and user type from cookies token
    let isAdmin, appointments;

    const allAppointments = await retrieveAllAppointments();    // Get all appointments from database

    if(type == 'admin'){                      // If is admin, then send all appointments
      isAdmin = true;
      appointments = allAppointments;
    }
    else{
      isAdmin = false;                  // If is normal user, send his/her own appointments only
      appointments = filterAppointments(allAppointments, name);   // Filter all the appointments based on the username
    }
  
    return res.json({                   // Send the response with data
      username: name,
      isAdmin: isAdmin,
      appointments: appointments
    })
  } catch (error) {
    return res.status(400).json({
      error: 'Erorr sending appointments to frontend:',
      message: error.message
    });
  }

}


// To return the other user's name list
const getUserList = async (req, res) => {

  try {

    const { name } = getUserInfo(res);    // Get the user's name from cookies token

    const userNames = await retrieveAllUsersExceptCurrentUser(name);  // Get all usernames except the current user

    return res.json(userNames);           // Send the response with the user list

  } catch (error) {
    return res.status(400).json({
      error: 'Error sending user list to frontend:',
      message: error.message
    });
  }

}


// To create a new appointment and store in database, then return all related appointements
const createAppointment = async (req, res) => {

  try {

    const gotAppointment = req.body;          // Get the new appointment
    const { name, type } = getUserInfo(res);  // Get the user's name from cookies token
    let isAdmin, appointments;

    // Add the username into creator property
    gotAppointment.creator = name;
    const newAppointment = new Appointment(gotAppointment);
    
    // Use await to wait for the save operation to complete
    await newAppointment.save();

    // Get all appointments from database
    const allAppointments = await retrieveAllAppointments();
  
    if (type == 'admin') {               // If is admin, then send all appointments
      isAdmin = true;
      appointments = allAppointments;    // Get all the appointments
    } else {
      isAdmin = false;                   // If is normal user, send his/her own appointments only
      appointments = filterAppointments(allAppointments, name);   // Filter all the appointments
    }
  
    return res.json({                    // Send the response with updated data
      username: name,
      isAdmin: isAdmin,
      appointments: appointments
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Error saving or processing appointment:',
      message: error.message
    });
  }

}


// To return a specific appointment based on id
const getSpecificAppointment = async (req, res) => {

  try {
    // Get the appointment id
    const id = req.params.id;   

    // Get the appointment from database based on id
    const appointment = await retrieveAppointmentByID(id);

    // send the appointment to frontend
    return res.json(appointment);

  } catch (error) {
    return res.status(400).json({
      error: 'Error sending specific appointment to frontend:',
      message: error.message
    });
  }

}


// To update a particular appointment data in database
const updateAppointment = async (req, res) => {
  
  try {
    const id = req.params.id;                 // The appointment id
    const updatedAppointment = req.body;      // Get the updated appointment
    const { name, type } = getUserInfo(res);  // Get the user's name and type
    let isAdmin, appointments;
  
    await updateAppointmentById(id, updatedAppointment);      // Update the appointment in database

    const allAppointments = await retrieveAllAppointments();  // Get all appointments from database 
    
  
    if(type == 'admin'){                // If is admin, then send all appointments
      isAdmin = true;
      appointments = allAppointments;   // Get all the appointments
    }
    else{
      isAdmin = false;                  // If is normal user, send his/her own appointments only
      appointments = filterAppointments(allAppointments, name);   // Filter all the appointments
    }
  
    return res.json({                          // Send the response with updated data
      username: name,
      isAdmin: isAdmin,
      appointments: appointments
    })

  } catch (error) {
    return res.status(400).json({
      error: 'Error updating appointment:',
      message: error.message
    });
  }

}


// To cancel the appointment
const cancelAppointment = async (req, res) => {

  try {
    const id = req.params.id;                 // The appointment id
    const newStatus = 'cancelled';            // Replace with the new status
    const { name, type } = getUserInfo(res);  // Get the user's name and type
    let isAdmin, appointments;
  
    await updateAppointmentStatusById(id, newStatus);   // Update appointment status

    const allAppointments = await retrieveAllAppointments();  // Get all appointments from database

    if(type == 'admin'){                // If is admin, then send all appointments
      isAdmin = true;
      appointments = allAppointments;   // Get all the appointments
    }
    else{
      isAdmin = false;                  // If is normal user, send his/her own appointments only
      appointments = filterAppointments(allAppointments, name);   // Filter all the appointments
    }
  
    return res.json({                   // Send the response with updated data
      username: name,
      isAdmin: isAdmin,
      appointments: appointments
    })
    
  } catch (error) {
    return res.status(400).json({
      error: 'Error updating appointment status:',
      message: error.message
    });
  }
  
}


// To update the user response
const updateUserResponse = async (req, res) => {

  try {
    const id = req.params.id;                 // The appointment id
    const { name, type } = getUserInfo(res);  // Get the user's name and type
    const userResponse = req.body;            // Get the user response
    let isAdmin, appointments;
  
    await updateAttendeeResponse(id, name, userResponse.response);  // Update the attendee response

    const allAppointments = await retrieveAllAppointments();  // Get all appointments from database

    if(type == 'admin'){                // If is admin, then send all appointments
      isAdmin = true;
      appointments = allAppointments;   // Get all the appointments !!!
    }
    else{
      isAdmin = false;                  // If is normal user, send his/her own appointments only
      appointments = filterAppointments(allAppointments, name);   // Filter all the appointments !!!
    }
  
    res.json({                          // Send the response with updated data
      username: name,
      isAdmin: isAdmin,
      appointments: appointments
    })
    
  } catch (error) {
    return res.status(400).json({
      error: 'Error updating attendee response:',
      message: error.message
    });
  }

    
  
}


module.exports = 
{ checkUserType,
  getAppointments,
  getUserList,
  createAppointment,
  getSpecificAppointment,
  updateAppointment,
  cancelAppointment,
  updateUserResponse
}

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


// Filter the appointments based on username
const filterAppointments = (appointmentList, username) => {
  const appointments = appointmentList.filter(appointment =>
    (appointment.creator === username ||    // If the user is creator or attendee of an appointment
    appointment.attendees.some(attendee => attendee.name === username)) && // And
    appointment.status === 'scheduled'      // If the appointment is scheduled (not cancelled)
  );

  return appointments;
}

let role = 'admin';
let username = 'Pikachu';


// Check the user is admin? return the response
const checkUserRole = (req, res) => {
  //role = 'user'        // Get the user's role !!!

  if(role == 'admin')
    res.send(true)
  else  
    res.send(false)
}


// To send the appointments to the user
const getAppointments = (req, res) => {
  //const username = 'Pikachu';         // Get the username !!!
  let isAdmin, appointments;

  //role = 'user';                     // Get the user's role !!!
  if(role == 'admin'){                // If is admin, then send all appointments
    isAdmin = true;
    appointments = appointmentList;   // Get all the appointments !!!
  }
  else{
    isAdmin = false;                  // If is normal user, send his/her own appointments only
    appointments = filterAppointments(appointmentList, username);   // Filter all the appointments !!!
  }

  res.json({                          // Send the response with data
    username: username,
    isAdmin: isAdmin,
    appointments: appointments
  })
}


// To return the other user's name list
const getUserList = (req, res) => {
  //const username = 'Pikachu';         // Get the username !!!

  // To filter out the username, return the all possible attendee user list
  const userList = attendees.filter(attendee => attendee !== username);   // Get all the username and do filter !!!

  res.json(userList);   // Send the response with the user list
}


// To store the new appointment and return all related appointements
const createAppointment = (req, res) => {
  const newAppointment = req.body;    // Get the new appointment
  //const username = 'Pikachu';         // Get the username !!!
  let isAdmin, appointments;

  // Store the new appointment in the database !!!
  newAppointment._id = '7sample';
  newAppointment.creator = username;
  appointmentList.push(newAppointment);

  if(role == 'admin'){                // If is admin, then send all appointments
    isAdmin = true;
    appointments = appointmentList;   // Get all the appointments !!!
  }
  else{
    isAdmin = false;                  // If is normal user, send his/her own appointments only
    appointments = filterAppointments(appointmentList, username);   // Filter all the appointments !!!
  }

  res.json({                          // Send the response with updated data
    username: username,
    isAdmin: isAdmin,
    appointments: appointments
  })

}


// To return a specific appointment based on id
const getSpecificAppointment = (req, res) => {
  const id = req.params.id;

  // Get the appointment object based on the id
  appointment_target = appointmentList.find(appointment => appointment._id === id);

  res.json(appointment_target);
}


// To update a particular appointment data in database
const updateAppointment = (req, res) => {
  const id = req.params.id;
  const updatedAppointment = req.body;      // Get the updated appointment
  let isAdmin, appointments;

  // Update the created appointment in the database !!!
  const index = appointmentList.findIndex(appointment => appointment._id === id);
  if (index !== -1) {
    // If the appointment with the given id is found
    appointmentList[index] = updatedAppointment;

    // console.log(appointmentList);

    if(role == 'admin'){                // If is admin, then send all appointments
      isAdmin = true;
      appointments = appointmentList;   // Get all the appointments !!!
    }
    else{
      isAdmin = false;                  // If is normal user, send his/her own appointments only
      appointments = filterAppointments(appointmentList, username);   // Filter all the appointments !!!
    }
  
    res.json({                          // Send the response with updated data
      username: username,
      isAdmin: isAdmin,
      appointments: appointments
    })

  } else {
    const errorResponse = {
      error: true,
      message: `Appointment with _id ${id} not found`,
    };

    res.status(404).json(errorResponse);
  }
}


// To cancel the appointment
const cancelAppointment = (req, res) => {
  const id = req.params.id;

  // Get the appointment object based on the id
  appointment_target = appointmentList.find(appointment => appointment._id === id);

  // Change the appointment status to cancelled
  appointment_target.status = 'cancelled';
  
  //const username = 'Pikachu';         // Get the username !!!
  let isAdmin, appointments;


  if(role == 'admin'){                // If is admin, then send all appointments
    isAdmin = true;
    appointments = appointmentList;   // Get all the appointments !!!
  }
  else{
    isAdmin = false;                  // If is normal user, send his/her own appointments only
    appointments = filterAppointments(appointmentList, username);   // Filter all the appointments !!!
  }

  res.json({                          // Send the response with updated data
    username: username,
    isAdmin: isAdmin,
    appointments: appointments
  })
}


// To update the user response
const updateUserResponse = (req, res) => {
  const id = req.params.id;
  const userResponse = req.body;      // Get the user response
  //const username = 'Pikachu';       // Get the username !!!
  let isAdmin, appointments;

  // Get the appointment object based on the id
  appointment_target = appointmentList.find(appointment => appointment._id === id);

  if (!appointment_target) {
    res.status(404).json({ error: 'Appointment not found' });
    return;
  }

  // Find the specific attendee based on the username
  const attendeeToUpdate = appointment_target.attendees.find(attendee => attendee.name === username);

  if (attendeeToUpdate) {
    // Update the response property for the found attendee
    attendeeToUpdate.response = userResponse.response;

    if(role == 'admin'){                // If is admin, then send all appointments
      isAdmin = true;
      appointments = appointmentList;   // Get all the appointments !!!
    }
    else{
      isAdmin = false;                  // If is normal user, send his/her own appointments only
      appointments = filterAppointments(appointmentList, username);   // Filter all the appointments !!!
    }
  
    res.json({                          // Send the response with updated data
      username: username,
      isAdmin: isAdmin,
      appointments: appointments
    })
  } else {
    // If the attendee with the specified username is not found
    res.status(404).json({ error: 'Attendee not found' });
  }
}


module.exports = 
{ checkUserRole,
  getAppointments,
  getUserList,
  createAppointment,
  getSpecificAppointment,
  updateAppointment,
  cancelAppointment,
  updateUserResponse
}
const appointmentList = [
  {
    _id: '1',
    creator: 'Jie Yi',
    title: 'Appointment 1',
    attendees: [
      {
        name: 'John',
        response: 'pending'
      },
      {
        name: 'Johnson',
        response: 'pending'
      },
      {
        name: 'Pikachu',
        response: 'declined'
      }
    ],
    location: 'USM',
    dateStart: '2023-12-25',
    dateEnd: '2023-12-25',
    timeStart: '3:30 PM',
    timeEnd: '4 PM',
    details: 'The appointment 1 is scheduled',
    status: 'scheduled'
  },
  {
    _id: '2',
    creator: 'Pikachu',
    title: 'Appointment 2',
    attendees: [
      {
        name: 'John',
        response: 'pending'
      },
      {
        name: 'Johnson',
        response: 'pending'
      }
    ],
    location: 'UTM',
    dateStart: '2023-12-24',
    dateEnd: '2023-12-24',
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
    timeStart: '8 AM',
    timeEnd: '9 AM',
    details: 'The appointment 3 is scheduled',
    status: 'cancelled'
  },
  {
    _id: '4',
    creator: 'Johnson',
    title: 'Appointment 4',
    attendees: [
      {
        name: 'Pikachu',
        response: 'pending'
      }
    ],
    location: 'UKM',
    dateStart: '2023-12-22',
    dateEnd: '2023-12-22',
    timeStart: '8 AM',
    timeEnd: '9 AM',
    details: 'The appointment 4 is scheduled',
    status: 'scheduled'
  },
  {
    _id: '5',
    creator: 'Johnson',
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
    timeStart: '8 AM',
    timeEnd: '9 AM',
    details: 'The appointment 5 is scheduled',
    status: 'scheduled'
  },
  {
    _id: '6',
    creator: 'Johnson',
    title: 'Appointment 6',
    attendees: [
      {
        name: 'Pikachu',
        response: 'accepted'
      }
    ],
    location: 'UKM',
    dateStart: '2023-12-28',
    dateEnd: '2023-12-28',
    timeStart: '8 AM',
    timeEnd: '9 AM',
    details: 'The appointment 6 is scheduled',
    status: 'scheduled'
  },

]

const attendee = ['Bulbasaur', 'Ivysaur', 'Venusaur', 'Charmander', 'Charmeleon', 'Pikachu', 'Raikou', 'Suikun', 'Entei']

// Check the user is admin? return the response
const checkUserRole = (req, res) => {
  role = 'admin'

  if(role == 'admin')
    res.send(true)
  else  
    res.send(false)
}

// To send the appointments to the user
const getAppointments = (req, res) => {
  const username = 'Pikachu';
  let isAdmin, appointments;

  role = 'admin';
  if(role == 'admin'){                // If is admin, then send all appointments
    isAdmin = true;
    appointments = appointmentList;
  }
  else{
    isAdmin = false;                  // If is normal user, send his/her own appointments only
    appointments = appointmentList.filter(appointment =>
      (appointment.creator === username ||    // If the user is creator or attendee of an appointment
      appointment.attendees.some(attendee => attendee.name === username)) &&
      appointment.status === 'scheduled'      // If the appointment is scheduled (not cancelled)
    );
  }

  res.json({
    username: username,
    isAdmin: isAdmin,
    appointments: appointments
  })
}

// To return the other user's name list
const getUserList = (req, res) => {
  const username = 'Pikachu';

  // To filter out the username, return the all possible attendee user list
  const userList = attendee.filter(attendee => attendee !== username);

  res.json(userList);
}

const storeNewAppointment = (req, res) => {
  const newAppointment = req.body;

  console.log(newAppointment);

  res.send('Success receive new appointment');
}

module.exports = 
{ checkUserRole,
  getAppointments,
  getUserList,
  storeNewAppointment
}
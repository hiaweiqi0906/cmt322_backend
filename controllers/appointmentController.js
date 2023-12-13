

const appointments = [
    {
        creator: 'Jie Yi',
        title: 'Appointment 1',
        attendees: ['John', 'Johnson', 'Pikachu'],
        venue: 'USM',
        dateStart: '2023-12-12',
        timeStart: '3pm',
        timeEnd: '4pm',
        description: 'The appointment is scheduled',
        status: 'created'
    }
]

const adminGetAppointment = (req, res) => {
    res.send(appointments);
    console.log('Get request');
}

module.exports = {adminGetAppointment}
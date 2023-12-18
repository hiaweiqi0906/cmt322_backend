

const appointments = [
    {
        id : '1',
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
        venue: 'USM',
        dateStart: '2023-12-18',
        dateEnd: '2023-12-18',
        timeStart: '3:30 PM',
        timeEnd: '4 PM',
        description: 'The appointment 1 is scheduled',
        status: 'scheduled'
    },
    {
        id : '2',
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
        venue: 'UTM',
        dateStart: '2023-12-15',
        dateEnd: '2023-12-15',
        timeStart: '',
        timeEnd: '',
        description: 'The appointment 2 is scheduled',
        status: 'scheduled'
    },
    {
        id : '3',
        creator: 'John',
        title: 'Appointment 3',
        attendees: [
            { 
                name: 'Johnson',
                response: 'pending'
            }
        ],
        venue: 'UKM',
        dateStart: '2023-12-22',
        dateEnd: '2023-12-22',
        timeStart: '8 AM',
        timeEnd: '9 AM',
        description: 'The appointment 3 is scheduled',
        status: 'cancelled'
    },
    {
        id : '4',
        creator: 'Johnson',
        title: 'Appointment 4',
        attendees: [
            { 
                name: 'Pikachu',
                response: 'pending'
            }
        ],
        venue: 'UKM',
        dateStart: '2023-12-15',
        dateEnd: '2023-12-15',
        timeStart: '8 AM',
        timeEnd: '9 AM',
        description: 'The appointment 4 is scheduled',
        status: 'scheduled'
    },
    {
        id : '5',
        creator: 'Johnson',
        title: 'Appointment 5',
        attendees: [
            { 
                name: 'Pikachu',
                response: 'pending'
            }
        ],
        venue: 'UKM',
        dateStart: '2023-12-22',
        dateEnd: '2023-12-22',
        timeStart: '8 AM',
        timeEnd: '9 AM',
        description: 'The appointment 5 is scheduled',
        status: 'scheduled'
    },
    {
        id : '6',
        creator: 'Johnson',
        title: 'Appointment 6',
        attendees: [
            { 
                name: 'Pikachu',
                response: 'accepted'
            }
        ],
        venue: 'UKM',
        dateStart: '2023-12-21',
        dateEnd: '2023-12-21',
        timeStart: '8 AM',
        timeEnd: '9 AM',
        description: 'The appointment 6 is scheduled',
        status: 'scheduled'
    },

]

const adminGetAppointment = (req, res) => {
    res.json(appointments);
}

module.exports = {adminGetAppointment}
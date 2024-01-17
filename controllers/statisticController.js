const Case = require('../models/case')
const User = require('../models/user')
const Notification = require('../models/notification')
const getUserInfo = require('../helpers/getUserInfo');
// const Appointment = require('../models/appointment')
const mongoose = require('mongoose');
const { hashPassword, comparePassword } = require('../helpers/auth')
const jwt = require('jsonwebtoken');

const dashboardStatistic = async (req, res) => {
    const { userId, type } = getUserInfo(res)
    try {
        const allNotifications = await Notifications.find({})
        const allCase = await Case.find({})
        const allUser = await User.find({})

        if (!allNotifications)
            throw new DataNotExistError("Notifications not exist")

        // TODO: Calculate statistics and res.return statistics 

        // dummy statistic data
        const caseStatistic = {
            "open": 34,
            "close": 25,
            "pending": 22
        }

        const userStatistic = {
            "admins": 12,
            "paralegals": 23,
            "clients": 43
        }

        const clientStatistic = {
            "serviceQuality": [
                5.0, 4.5, 4.7, 3.6, 4.7, 5.0
            ],
            "communication": [
                5.0, 4.5, 4.7, 3.6, 4.7, 5.0
            ],
            "professionalism": [
                5.0, 4.5, 4.7, 3.6, 4.7, 5.0
            ],
            "clientOverallSatisfactoryRating": [
                5.0, 4.5, 4.7, 3.6, 4.7, 5.0
            ],
        }

        const NotificationsStatistic = {
            "activity": {
                "upload": [5, 3, 8, 3, 4, 3],
                "request": [3, 5, 6, 9, 6, 5],
                "interact": [15, 5, 18, 10, 9, 5]
            }, /** { "upload": 5, "request": 3, "interact": 15 }, 
            { "upload": 3, "request": 5, "interact": 5 }, 
            { "upload": 8, "request": 6, "interact": 18 }, 
            { "upload": 3, "request": 9, "interact": 10 }, 
            { "upload": 4, "request": 6, "interact": 9 },
            { "upload": 3, "request": 5, "interact": 5 } */
            "recentlyUpload": {
                "docTitle": ["Lawyer intro 1", "Lawyer intro 2", "Lawyer intro 3", "Lawyer intro 4", "Lawyer intro 5", "Lawyer intro 6"],
                "uploadedBy": ["(P) Mr Cheah", "(P) Mr Cheah", "(P) Mr Cheah", "(P) Mr Cheah", "(P) Mr Cheah", "(P) Mr Cheah"],
                "uploadedAt": ["1 hour ago...", "1 hr 30 mins ago...", "2 hour ago...", "2 hr 30 mins ago...", "3 hour ago...", "3 hr 20 mins ago..."]
            }, /**
            { "docTitle": "Lawyer intro 1", "uploadedBy": "(P) Mr Cheah", "uploadedAt": "1 hour ago..." }, 
                { "docTitle": "Lawyer intro 1", "uploadedBy": "(P) Mr Cheah", "uploadedAt": "1 hr 30 mins ago..." }, 
                { "docTitle": "Lawyer intro 1", "uploadedBy": "(P) Mr Cheah", "uploadedAt": "2 hour ago..." }, 
                { "docTitle": "Lawyer intro 1", "uploadedBy": "(P) Mr Cheah", "uploadedAt": "2 hr 30 mins ago..." }, 
                { "docTitle": "Lawyer intro 1", "uploadedBy": "(P) Mr Cheah", "uploadedAt": "3 hour ago..." }, 
                { "docTitle": "Lawyer intro 1", "uploadedBy": "(P) Mr Cheah", "uploadedAt": "3 hr 20 mins ago..." }, 
            
            */
        }

        return res.status(200).send({caseStatistic, userStatistic, clientStatistic, NotificationsStatistic})
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            // Mongoose validation error
            const validationErrors = {};

            for (const field in error.errors)
                validationErrors[field] = error.errors[field].message;

            return res.status(400).json({
                error: 'Validation failed',
                validationErrors,
            });
        } else {
            res.status(400).json({
                error: error.name,
                message: error.message
            })
        }
    }
}

const getNotifications = async (req, res) => {
    const { userId, type } = getUserInfo(res)
    const allUpdatedNoti = []
    try {
        const allNotifications = await Notification.find(
            {
                "notification_recipient_id_and_status.recipient_id": userId,
            }
        ).sort( { "notification_sent_date": -1 } )

        allNotifications.forEach((noti, i)=>{
            let read = false
            noti._doc.notification_recipient_id_and_status.forEach(stat=>{
                if(stat.recipient_id === userId && stat.status === "read") 
                    read = true;
            })
            allUpdatedNoti.push({...noti._doc, read})
        })

        const unreadNoti = allUpdatedNoti.filter((noti)=> {return !noti.read})
        const readNoti = allUpdatedNoti.filter((noti)=> {return noti.read})

        const updatedNoti = await Notification.updateMany({
            "notification_recipient_id_and_status.recipient_id": userId
          }, {
            $set: {
              "notification_recipient_id_and_status.$.status": "read"
            }
          })

        if (!allNotifications)
            throw new DataNotExistError("Notifications not exist")

        return res.status(200).send([...unreadNoti, ...readNoti])
    } catch (error) {
        if (error instanceof mongoose.Error.ValidationError) {
            // Mongoose validation error
            const validationErrors = {};

            for (const field in error.errors)
                validationErrors[field] = error.errors[field].message;

            return res.status(400).json({
                error: 'Validation failed',
                validationErrors,
            });
        } else {
            res.status(400).json({
                error: error.name,
                message: error.message
            })
        }
    }
}


module.exports = { dashboardStatistic, getNotifications }
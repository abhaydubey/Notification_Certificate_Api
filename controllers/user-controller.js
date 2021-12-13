const express = require('express');
const router = express.Router();
const BaseResponse = require('../utilities/response');
const { watiNotification } = require('../utilities/notification/wati-notification');
//const { emailNotification } = require('../utilities/notification/email-notification');
router.post('/send-notification', async (req, res) => {
    try {
        const  data  = req.body;
        const paramArray = [
            {
                "name": "1",
                "value": data.name
            }, {
                "name": "2",
                "value": data.classTitle
            },
            {
                "name": "3",
                "value": data.classStartDateTime
            },
            {
                "name": "4",
                "value": data.classLink
            },
            {
                "name": "5",
                "value": '9718106956'
            }
        ]
     console.log('paramArray',paramArray)
        //await watiNotification(data.phone_number, 'reminder_class', paramArray)

        // const html = await renderTemplate(path.join(__dirname, '../utilities/pug/templates/class-reminder.pug'), {
        //     firstName: value.user.dataValues.firstName,
        //     startDate: new Date(value.course.dataValues.CourseClasses[0].dataValues.startDate).toDateString(),
        //     time: new Date(value.course.dataValues.CourseClasses[0].dataValues.startDate).toLocaleTimeString(),
        //     link: value.course.dataValues.CourseClasses[0].dataValues.otherMeetingLink ? value.course.dataValues.CourseClasses[0].dataValues.otherMeetingLink : value.course.dataValues.CourseClasses[0].dataValues.attendeeJoinUrl ? value.course.dataValues.CourseClasses[0].dataValues.attendeeJoinUrl : 'Link in your profile on website'
        // });

        // await emailNotification({
        //     body: {
        //         email: value.user.dataValues.email,
        //         subject: 'Class Notification'
        //     },
        //     html
        // });

        return res.status(200).json(BaseResponse.sendSuccess('Notification sent.'));


    } catch (err) {
        console.log('error',err);
        return res.status(400).json(BaseResponse.sendError('Bad request!.', err));
    }


});

module.exports = router;
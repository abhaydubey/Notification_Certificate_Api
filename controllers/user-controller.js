const express = require('express');
const router = express.Router();
const path = require('path');
const BaseResponse = require('../utilities/response');
const { watiNotification } = require('../utilities/notification/wati-notification');
const renderTemplate = require('../utilities/pug/pug');
const { emailNotification } = require('../utilities/notification/email-notification');
const { mobileNotification } = require('../utilities/notification/mobile-notification');
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
     
       await watiNotification(data.phone_number, 'reminder_class', paramArray)

        const html = await renderTemplate(path.join(__dirname, '../utilities/pug/templates/class-reminder.pug'), {
            firstName: data.name,
            startDate: data.classStartDateTime,
            time: '',
            link: data.classLink
        });

        await emailNotification({
            body: {
                email: data.email,
                subject: data.classTitle
            },
            html
        });


        await mobileNotification(data.phone_number,
            `Dear ${data.name}
             UniKaksha Class Reminder 
             Date: ${data.classStartDateTime}
             Time: ${data.classStartDateTime}
             Link: ${data.classLink}
             If you need some last-minute help, call us at : 9718106956`
        );

        return res.status(200).json(BaseResponse.sendSuccess('Notification sent.'));


    } catch (err) {
        console.log('error',err);
        return res.status(400).json(BaseResponse.sendError('Bad request!.', err));
    }


});

module.exports = router;
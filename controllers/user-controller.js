const express = require('express');
const router = express.Router();
const path = require('path');
const BaseResponse = require('../utilities/response');
const { watiNotification } = require('../utilities/notification/wati-notification');
const renderTemplate = require('../utilities/pug/pug');
const { emailNotification } = require('../utilities/notification/email-notification');
const { mobileNotification } = require('../utilities/notification/mobile-notification');
const { createInvoice } = require('../utilities/invoice/createInvoice');
const InvoiceObj  = require('../validationObj/InvoiceObj');

const validateResourceMW = (resourceSchema) => async (req, res, next) => {
    const resource = req.body;
    try {
      await resourceSchema.validate(resource,{ abortEarly: false });
      next();
    } catch (e) {
      console.error(e);
      res.status(400).json({ error: e.errors.join(', ') });
    }
  };



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


router.post('/invoice',validateResourceMW(InvoiceObj), async (req, res) => {
    try {
        const  data  = req.body;
        const Obj = {
            "billedBy": {
                "name": "Code Shastra Pvt Ltd",
                "street": "D-144, Ground Floor, Sushant Lok - 3, Sector - 57, Gurgaon Haryana",
                "city": "Gurgaon",
                "pincode": "122003",
                "gstState": "24",
                "country": "IN"
            },
            "billedTo": {
                "name": data.user_name,
                "street": data.street,
                "city": data.city,
                "pincode": data.pincode,
                "gstState": data.gstState,
                "country": data.country_code
            },
            "items": [
                {
                    "rate": Number.parseInt(data.amount),
                    "quantity": data.quantity,
                    "gstRate": Number.parseInt(data.gstAmount),
                    "name": data.item_name
                }
            ],
            "email": {
                "to": {
                    "name": data.user_name,
                    "email": data.email
                }
            }
        };
        await createInvoice(Obj);
        return res.status(200).json(BaseResponse.sendSuccess('Invoice created.'));


    } catch (err) {
        console.log('error',err);
        return res.status(400).json(BaseResponse.sendError('Bad request!.', err));
    }


});

module.exports = router;
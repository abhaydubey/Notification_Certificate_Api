const express = require('express');
const router = express.Router();
const path = require('path');
const BaseResponse = require('../utilities/response');
const renderTemplate = require('../utilities/pug/pug');
const { watiNotification } = require('../utilities/notification/wati-notification');
const { emailNotification } = require('../utilities/notification/email-notification');
const { mobileNotification } = require('../utilities/notification/mobile-notification');

const { createInvoice } = require('../utilities/invoice/createInvoice');
const InvoiceObj  = require('../validationObj/InvoiceObj');
const notificationObj  = require('../validationObj/notificationObj');
var axios = require('axios');
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



router.post('/send-notification',validateResourceMW(notificationObj), async (req, res) => {
    try {
        const  data  = req.body;
         const notification_type = ['reminder_class','welcome','enroll_course','payment_failed','payment_sucess','approve_otp']
         const status = notification_type.includes(data.notification_type);

         if(!status){
            return res.status(400).json(BaseResponse.sendError('Notification type should any one of this!.', notification_type));  
         }
        switch(data.notification_type) {

            case 'reminder_class':              
               // here if IsWhatsapp true 
              if(data.IsWhatsapp){
                const paramArray = [
                    {
                        "name": "1",
                        "value": data.name
                    }, 
                    {
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
              }
              // Whatsapp Notification end here

              // Email notification here

              if(data.IsEmail){

                const html = await renderTemplate(path.join(__dirname, '../utilities/pug/templates/class-reminder.pug'), {
                    firstName: data.name,
                    //startDate: data.classStartDateTime,
                    time: '',
                    link: data.classLink
                });
        
                await emailNotification({
                    body: {
                        email: data.email,
                        //subject: data.classTitle
                    },
                    html
                });

              }

              // Email notification end here

              //   if(data.IsSMS){
              //   await mobileNotification(data.phone_number,

              //       `Dear ${data.name}
              //        UniKaksha Class Reminder 
              //        Date: ${data.classStartDateTime}
              //        Time: ${data.classStartDateTime}
              //        Link: ${data.classLink}
              //        If you need some last-minute help, call us at : 9718106956`
              //   )
              //   }

              // break;


                case 'approve_otp':
                    //console.log(data);
                    if(data.IsSMS){
                    await mobileNotification(data.phone_number, `Thank you for registering on Unikaksha, please use ${data.name} as your OTP to complete your registration process. -Unikaksha -Unikaksha`);
                    }

                break;


                 case 'welcome':
               // here if IsWhatsapp true 
                if(data.IsWhatsapp){
                    const welcomeParams = [
                    {
                        "name": "1",
                        "value": user.name
                    }, {
                        "name": "2",
                        "value": 'support@unikaksha.com'
                    }];
                const whatsapp = await watiNotification(data.phone_number, 'welcome', welcomeParams);

                }
              
              // Whatsapp Notification end here

              // Email notification here

                if(data.IsEmail){

                    const html = await renderTemplate(path.join(__dirname, '../utilities/pug/templates/welcome.pug'), {
                        name: data.name
                });


                const emailService = await emailNotification({
                    body: {
                        email: data.email,
                        subject: 'Confirmation'
                    },
                    html
                });

              }

              // Email notification end here

              if(data.IsSMS){
                console.log('a111a11', IsSMS)

                await mobileNotification(data.phone_number, `
                Welcome! We are so glad to have you on board. Let’s begin this exciting journey of learning at scale.

                See you soon!
                Team UniKaksha
                `);

              }
              break;

              case 'enroll_course':
               // here if IsWhatsapp true 
              if(data.IsWhatsapp){
                const paramArray = [
                    {
                        "name": "1",
                        "value": data.name
                    }, {
                        "name": "2",
                        "value": data.classTitle
                    }
                ]

                await watiNotification(data.phone_number, 'enroll_course', paramArray)

              }
              // Whatsapp Notification end here

              // Email notification here

              if(data.IsEmail){

                const enrollmentHtml = await renderTemplate(path.join(__dirname, '../utilities/pug/templates/enrolled.pug'), {});

                await emailNotification({
                    body: {
                        email: data.email,
                        subject: 'Enrollment'
                    },
                    html: enrollmentHtml
                });

              }

              // Email notification end here

              if(data.IsSMS){
                console.log('aaaaaaaaaa', IsSMS)

             await mobileNotification(data.phone_number, `
                    Welcome ${data.name} ! You have been successfully enrolled in ${data.classTitle}. We are thrilled to be partnering with you as you participate in an exciting journey of upskilling and redefining yourself.
                    Best Wishes,
                    Team UniKaksha
                    `);

              }

              break;

              case 'payment_failed':
                // here if IsWhatsapp true 
               if(data.IsWhatsapp){
                const params = [
                    {
                        "name": "1",
                        "value": data.name
                    }
                ];
                await watiNotification(data.phone_number, 'payment_failed', params);
              }
               // Whatsapp Notification end here
 
               // Email notification here
 
               if(data.IsEmail){
 
                const paymentHtml = await renderTemplate(path.join(__dirname, '../utilities/pug/templates/payment-failed.pug'), {
                    name: data.name
                });
    
                await emailNotification({
                    body: {
                        email: data.email,
                        subject: 'Payment'
                    },
                    html: paymentHtml
                });
 
               }
 
               // Email notification end here
 
               if(data.IsSMS){
 
                await mobileNotification(data.phone_number,
                    `Dear ${data.name},Unfortunately, we have not received your payment. Please try again after some time.
                Best Wishes,
                Team UniKaksha
                `);
 
               }
               break;

               case 'payment_sucess':
                // here if IsWhatsapp true 
               if(data.IsWhatsapp){
                const paymentParams = [
                    {
                        "name": "1",
                        "value": data.name
                    }, {
                        "name": "2",
                        "value": data.actualDeductAmount
                    }
                ];
                await watiNotification(data.phone_number, 'payment_sucess', paymentParams);

              }
               // Whatsapp Notification end here
 
               // Email notification here
 
               if(data.IsEmail){
 
                const paymentHtml = await renderTemplate(path.join(__dirname, '../utilities/pug/templates/payment-done.pug'), {
                    name: data.name,
                    amount: data.actualDeductAmount,
                    contact: "9718106956"
                });

                await emailNotification({
                    body: {
                        email: data.email,
                        subject: 'Payment'
                    },
                    html: paymentHtml
                });
 
               }
 
               // Email notification end here
 
               if(data.IsSMS){
 
                await mobileNotification(data.phone_number, `
                        Dear ${data.name}, Payment successful!  We have received your payment of Rs ${actualDeductAmount}. For any help reach out to us at ${config.dataValues.contactNumber}.
                        Best Wishes,
                        Team UniKaksha
                        `);
 
               }
               break;

            default:
              // code block
          }


        return res.status(200).json(BaseResponse.sendSuccess('Notification sent.', data));


    } 

    catch (err) {
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
        // console.log('111111111',res)
        return res.status(200).json(BaseResponse.sendSuccess('Invoice created.'));

    } catch (err) {
        console.log('error',err);
        return res.status(400).json(BaseResponse.sendError('Bad request!.', err));
    }

});


router.post('/create-certificate', async(req, res) => {
  
    var data = JSON.stringify({
        
      "title": req.body.recipientName,
      "description": req.body.courseName,
      "duration": req.body.courseDuration,
      "expireDate":req.body.completionDate,
      "durationNumber": req.body.durationNumber,
      "durationType": req.body.durationType,
      "cost": req.body.cost,
      "level": req.body.level,
      "type": req.body.type

    });

    var config = {
      method: 'post',
      url: 'https://b2b.sertifier.com/Detail/AddDetail',
      headers: { 
        'api-version': '2.1', 
        'secretKey': '690ec5c1593147d9bc092d88a6571e57821bd37aedb2469c832f57b68878974060f49e8d903b47dc9583e9492de6648c8daf6c324d304c1c8bf67691a44e5f32', 
        'Content-Type': 'application/json'
      },
      data : data
    };

    axios(config)
        .then(function (response) {
            if(response.data.hasError){
                res.status(400).json({message:"validation error",errors: response.data.validationErrors});
            }else {
                res.status(200).json({message:"Create successfully",data:response.data});     
            }
        })
       .catch(function (error) {
            res.status(500).json({error})
    });
})


module.exports = router;
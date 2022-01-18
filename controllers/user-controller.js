const express = require('express');
const router = express.Router();
const path = require('path');
const BaseResponse = require('../utilities/response');
const renderTemplate = require('../utilities/pug/pug');
const { watiNotification } = require('../utilities/notification/wati-notification');
const { emailNotification } = require('../utilities/notification/email-notification');
const { mobileNotification } = require('../utilities/notification/mobile-notification');

const notificationObj  = require('../validationObj/notificationObj');
const validateResourceMW = (resourceSchema) => async (req, res, next) => {
  const resource = req.body;
  try {
    await resourceSchema.validate(resource,{ abortEarly: false });
    next();
  } catch (e) {
    res.status(400).json({ error: e.errors.join(', ') });
  }
};

router.post('/send-notification',validateResourceMW(notificationObj), async (req, res) => {
  try {
    const  data  = req.body;
    const notification_type = ['reminder_class','welcome','enroll_course','payment_failed','payment_success','approve_otp']
    const status = notification_type.includes(data.notification_type);
    if(!status){
      return res.status(400).json(BaseResponse.sendError('Notification type should any one of this!.', notification_type));  
    }
    switch(data.notification_type) {

      case 'reminder_class':              
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
              "value": data.classStartTime
            },
            {
              "name": "4",
              "value": data.classLink
            },
            {
              "name": "5",
              "value": '9718106956'
            }
          ];
          await watiNotification(data.phone_number, 'reminder_class', paramArray)
        }
        // Whatsapp Notification end here

        // Email notification here

        if(data.IsEmail){
          const html = await renderTemplate(path.join(__dirname, '../utilities/pug/templates/class-reminder.pug'), {
            firstName: data.name,
            title: data.title,
            startDate: data.classStartDate,
            time: data.classStartTime,
            link: data.classLink
          });
          await emailNotification({
            body: {
              email: data.email,
              subject: 'Class Reminder'
            },
            html
          });
        }

        // Email notification end here

        if(data.IsSMS){
            
          await mobileNotification(data.phone_number,
            `Dear ${data.name}\n\nUni Kaksha Class Reminder\nTime: ${data.classStartTime}\nLink: ${data.classLink}\n\nIf you need some last-minute help, call us at : 9718106956 -Unikaksha`,
            data.notification_type,
          )
        }

      break;

      case 'approve_otp':
        if(data.IsSMS){
          await mobileNotification(data.phone_number, `Thank you for registering on Unikaksha, please use ${data.OTP} as your OTP to complete your registration process. -Unikaksha -Unikaksha`, data.notification_type,);
        }
      break;


      case 'welcome':
        // here if IsWhatsapp true 
        if(data.IsWhatsapp){
          const welcomeParams = [
          {
            "name": "1",
            "value": data.name
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
          await mobileNotification(data.phone_number, `Welcome ${data.name}!\n\nWe are so glad to have you onboard. Let's begin this exciting journey of learning at scale.\n\nSee you soon!\nTeam -Unikaksha`,
          data.notification_type);
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

        // SMS is not approved
        // if(data.IsSMS) {
        //     await mobileNotification(data.phone_number, `
        //         Welcome ${data.name} ! You have been successfully enrolled in ${data.classTitle}. We are thrilled to be partnering with you as you participate in an exciting journey of upskilling and redefining yourself.
        //         Best Wishes,
        //         Team UniKaksha
        //         `,
        //         data.notification_type,
        //     );
        // }

        break;

      case 'payment_failed':
        // here if IsWhatsapp true 
        if(data.IsWhatsapp){
          const params = [
            {
              "name": "1",
              "value": data.name
            }, {
              "name": "2",
              "value": 'support@unikaksha.com'
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
            `Dear ${data.name},\n\nUnfortunately, we have not received your payment. Please try again after some time.\n\nBest Wishes,\nTeam -Unikaksha`,
            data.notification_type,
          );
        }
        break;

      case 'payment_success':
        // here if IsWhatsapp true 
        if(data.IsWhatsapp){
          const paymentParams = [
            {
              "name": "1",
              "value": data.name
            }, {
              "name": "2",
              "value": data.amount
            }
          ];
          await watiNotification(data.phone_number, 'payment_sucess', paymentParams);

        }
        // Whatsapp Notification end here

        // Email notification here

        if(data.IsEmail){
          const paymentHtml = await renderTemplate(path.join(__dirname, '../utilities/pug/templates/payment-done.pug'), {
            name: data.name,
            amount: data.amount,
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
          await mobileNotification(data.phone_number,
            `Dear ${data.name},\n\nPayment successful!  We have received your payment of Rs. ${data.amount}. For any help reach out to us at 9718106956\n\nBest Wishes,\nTeam -Unikaksha`,
            data.notification_type,
          );
        }
      break;

      default:
        // code block
    }
    return res.status(200).json(BaseResponse.sendSuccess('Notification sent.', data));
  } 

  catch (err) {
    return res.status(400).json(BaseResponse.sendError('Bad request!.', err));
  }
});

module.exports = router;
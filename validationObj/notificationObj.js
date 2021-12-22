const yup = require('yup');

// Just like before, without the id field
const notificationObj = yup.object({
  notification_type: yup.string().required(),
  IsEmail: yup.boolean().required(),
  IsWhatsapp: yup.boolean().required(),
  IsSMS: yup.boolean().required(),
  name: yup.string().required(),
  classTitle: yup.string().required(),
  classStartDate: yup.string().required(),
  classStartTime: yup.string().required(),
  classLink: yup.string().required(),
  phone_number: yup.string().required(),
  email: yup.string().email('Must be a valid email').required(),
  amount:yup.number().required(),
});

module.exports =notificationObj;

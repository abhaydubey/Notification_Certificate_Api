const yup = require('yup');

// Just like before, without the id field
const notificationObj = yup.object({
  user_name: yup.string().required(),
  street: yup.string().required(),
  city: yup.string().required(),
  pincode: yup.string().required(),
  gstState: yup.string().required(),
  country_code: yup.string().required(),
  amount: yup.number().positive().required(),
  quantity: yup.number().required(),
  gstAmount: yup.number().positive().required(),
  item_name: yup.string().required(),
  email: yup.string().email('Must be a valid email').required(),
});

module.exports =notificationObj;

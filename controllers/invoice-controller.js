const express = require('express');
const router = express.Router();
const BaseResponse = require('../utilities/response');
const { createInvoice } = require('../utilities/invoice/createInvoice');
const InvoiceObj  = require('../validationObj/InvoiceObj');
const validateResourceMW = (resourceSchema) => async (req, res, next) => {
  const resource = req.body;
  try {
    await resourceSchema.validate(resource,{ abortEarly: false });
    next();
  } catch (e) {
    res.status(400).json({ error: e.errors.join(', ') });
  }
};

router.post('/create',validateResourceMW(InvoiceObj), async (req, res) => {
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
    return res.status(400).json(BaseResponse.sendError('Bad request!.', err));
  }
});

module.exports = router;
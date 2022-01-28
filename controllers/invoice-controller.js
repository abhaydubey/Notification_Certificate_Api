const express = require('express');
const router = express.Router();
const axios = require('axios');
const CircularJSON = require('circular-json')

router.post('/create', async (req, res) => {

    var data = CircularJSON.stringify({
      "strategy":"app-secret",
      "appId":"code-shastra-pvt-ltd",
      "appSecret":"6ca98d90cfef93629@253c2881C5f60a49bA9fcf3"
    }); 

    const config = {
        method: 'post',
        url: 'https://api.refrens.com/authentication',
        headers: { 
            'Content-Type': 'application/json'
        },
        data : data
    };

    axios(config)

        .then(function (response) {

        // create invoice 
            var data = CircularJSON.stringify({
              "dueDate":req.body.dueDate,
              "invoiceType":req.body.invoiceType,
              "billedBy":req.body.billedBy,
              "name":req.body.name,
              "street":req.body.street,
              "city":req.body.city,
              "pincode": req.body.pincode,
              "gstState": req.body.gstState,
              "country": req.body.country,
              "billedTo":req.body.billedTo,
              "name":req.body.name,
              "email":req.body.email,
              "items":req.body.items,
              "rate":req.body.rate,
              "quantity":req.body.quantity,
              "gstRate":req.body.gstRate,
              "name":req.body.name
            });

            const config1 = {
                method: 'post',
                url: 'https://api.refrens.com/businesses/code-shastra-pvt-ltd/invoices',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer '+response.data.accessToken
                },
                data : data
            };

            axios(config1)
                .then(function (response1) {

                })
                .catch(function (error) {
                  console.log(error);
                });
          
            res.status(200).json({message:'Create invoice successfully:',data})  
        })
        .catch(function (error) {
          console.log(error);
        });

})

module.exports = router;
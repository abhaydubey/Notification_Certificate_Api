const express = require('express');
const router = express.Router();
var axios = require('axios');

router.post('/create', async(req, res) => {
  
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
      } else {
        res.status(200).json({message:"Create successfully",data:response.data});     
      }
    })
    .catch(function (error) {
      res.status(500).json({error})
  });
})

module.exports = router;
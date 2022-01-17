var axios = require('axios');


const createInvoice = async (dataObj) => {
  var data = JSON.stringify({
    "strategy": "app-secret",
    "appId": "code-shastra-pvt-ltd",
    "appSecret": "6ca98d90cfef93629@253c2881C5f60a49bA9fcf3"
  });
  var config = {
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
   var datastring = JSON.stringify(dataObj);

    var configIn = {
      method: 'post',
      url: 'https://api.refrens.com/businesses/code-shastra-pvt-ltd/invoices',
      headers: { 
        'Authorization': 'Bearer '+response.data.accessToken, 
        'Content-Type': 'application/json'
      },
      data : datastring
    };

  axios(configIn)
  .then(function (response) {
    return response.data;
  })
  .catch(function (error) {
    console.log('in error',error);
  });


  })
  .catch(function (error) {
    console.log('auth error',error);
  });
  
   
};

module.exports = { createInvoice };
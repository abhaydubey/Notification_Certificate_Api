

var axios = require('axios');

const watiNotification = async (toNumber,template, paramArray) => {
    var data = JSON.stringify({
        "template_name": template,
        "broadcast_name": "test",
        "parameters": paramArray
      });
      
      var config = {
        method: 'post',
        url: 'https://live-server-5391.wati.io/api/v1/sendTemplateMessage?whatsappNumber='+toNumber,
        headers: { 
          'accept': '*/*', 
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1MjQyZDBlMS0zZGI2LTQyNTEtYTI4Ny0yMjY4NDI5MGNiZWYiLCJ1bmlxdWVfbmFtZSI6InJhai5rdW1hckBjb2Rlc2hhc3RyYS5jb20iLCJuYW1laWQiOiJyYWoua3VtYXJAY29kZXNoYXN0cmEuY29tIiwiZW1haWwiOiJyYWoua3VtYXJAY29kZXNoYXN0cmEuY29tIiwiYXV0aF90aW1lIjoiMDkvMjQvMjAyMSAxMDoxMzoyNCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFETUlOSVNUUkFUT1IiLCJleHAiOjI1MzQwMjMwMDgwMCwiaXNzIjoiQ2xhcmVfQUkiLCJhdWQiOiJDbGFyZV9BSSJ9.z6GAGvUangeSvpdwhDMrpHW5NMF4eGbyUBHUpnPJdj0', 
          'Content-Type': 'application/json-patch+json',
        },
        data : data
      };
      
      axios(config)
      .then(function (response) {
        return response.data;
        //console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
};

module.exports = { watiNotification };
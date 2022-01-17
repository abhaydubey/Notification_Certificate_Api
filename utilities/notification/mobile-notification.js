
const AWSKey = require('../../config/aws-config.json').bucket;
var AWS = require("aws-sdk");
var sns = new AWS.SNS({
		accessKeyId: AWSKey.accessKeyId,
		secretAccessKey: AWSKey.secretAccessKey,
		region: AWSKey.region
   	});

const mobileNotification = async (toNumber, message) => {
		AWS.config.update({
		Version: "2012-10-17",
		accessKeyId: AWSKey.accessKeyId,
		secretAccessKey: AWSKey.secretAccessKey,
		region: AWSKey.region,
	});

    var params = {
	  	Message: message,
	  	PhoneNumber: toNumber,
	  	MessageAttributes: {
	    	'AWS.SNS.SMS.SenderID': {
		      DataType: 'String',
		      StringValue: 'UKAKSH'
				},
			'AWS.MM.SMS.EntityId': {
			      DataType: 'String',
			      StringValue: '1101548900000057604'//Replace this
			},
			'AWS.MM.SMS.TemplateId': {
		      	DataType: 'String',
		      	StringValue: '1107163860646612736' //Replace this
		    },
			'AWS.SNS.SMS.SMSType': {
	      		DataType: 'String',
	      		StringValue: 'Transactional'
	    	}
	  	},
  	}	
 
    return sns.publish(params).promise()
   		.then(message => {
   		console.log('test success', message)
   		})
   		.catch(err => {
   		console.log("Error "+err)
   		return err;
   		});
};


module.exports = { mobileNotification };
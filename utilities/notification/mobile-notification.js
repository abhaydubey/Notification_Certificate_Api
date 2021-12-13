const AWSKey = require('../../config/aws-config.json').bucket;
const AWS = require('aws-sdk');

const mobileNotification = async (toNumber, message) => {

	AWS.config.update({
		Version: "2012-10-17",
		accessKeyId: AWSKey.accessKeyId,
		secretAccessKey: AWSKey.secretAccessKey,
		region: AWSKey.region
	});
	
	var params = {
		Message: message, /* required */
		PhoneNumber: toNumber,
	};

	return new AWS.SNS({ Version: "2012-10-17" }).publish(params).promise()
		.then(message => {
			console.log("test success" + JSON.stringify(message));
		})
		.catch(err => {
			console.log("Error "+err)
			return err;
		});
};

module.exports = { mobileNotification };
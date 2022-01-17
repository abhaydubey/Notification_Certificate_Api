
const AWSKey = require('../../config/aws-config.json').bucket;
var AWS = require("aws-sdk");
var sns = new AWS.SNS({
  accessKeyId: AWSKey.accessKeyId,
  secretAccessKey: AWSKey.secretAccessKey,
  region: AWSKey.region
});

const templateId = {
	'reminder_class': '1107163343750463816',
	'welcome': '1107163464571694516',
	'enroll_course': '',
	'payment_failed': '1107163465330734731',
	'payment_success': '1107163465308721848',
	'approve_otp': '1107163860646612736',
};

const mobileNotification = async (toNumber, message, notification_type) => {
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
      StringValue: templateId[notification_type] //Replace this
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
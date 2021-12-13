const AWSKey = require('../../config/aws-config.json').bucket;
const AWS = require('aws-sdk');

const emailNotification = async ({
    body,
    html,
    returnType
}) => {
    // Set the region 
    AWS.config.update({
        apiVersion: "2010-12-01",
        accessKeyId: AWSKey.accessKeyId,
        secretAccessKey: AWSKey.secretAccessKey,
        region: AWSKey.region
    });

    // Create sendEmail params 
    const params = {
        Destination: {
            ToAddresses: [
                body.email
            ]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: html
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: body.subject
            }
        },
        Source: 'no-reply@unikaksha.com',
        ReplyToAddresses: [
            'no-reply@unikaksha.com',
        ],
    };

    // Create the promise and SES service object
    const sendPromise = new AWS.SES({
        apiVersion: '2010-12-01'
    }).sendEmail(params).promise();

    if (returnType === "promise") {
        return sendPromise;
    }
    else {
        // Handle promise's fulfilled/rejected states
        return sendPromise.then(
            function (data) {
                return data;
            }).catch(
                function (err) {
                    // console.error(err, err.stack);
                    return err
                }
            );
    }

};

module.exports = {
    emailNotification
};
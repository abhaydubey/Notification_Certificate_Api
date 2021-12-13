const twilio = require('../../config/aws-config.json').twilio;
const client = require('twilio')(twilio.TWILIO_ACCOUNT_SID, twilio.TWILIO_AUTH_TOKEN);

const whatsappNotification = async (toNumber, message) => {

    const messageResponse = client.messages
        .create({
            from: 'whatsapp:+18303550391',
            body: `${message}`,
            to: `whatsapp:${toNumber}`
        });
    return messageResponse;

};

module.exports = { whatsappNotification };
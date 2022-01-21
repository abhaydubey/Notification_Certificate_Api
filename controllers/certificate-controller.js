const express = require('express');
const router = express.Router();
const axios = require('axios');
const CircularJSON = require('circular-json')

router.post('/create', async (req, res) => {
    var data = JSON.stringify({
        "type": req.body.type,
        "title": req.body.Course_Name,
        "description": req.body.Course_Description,
        "durationType": req.body.durationType,
        "cost": req.body.cost,
        "level": req.body.level,
        "expireDate": req.body.expireDate,
        "duration": req.body.duration,
        "durationNumber": req.body.durationNumber,
        "skills": req.body.skills,
        "title": req.body.title,
        "skillId": req.body.skillId,
        "languageCode": req.body.languageCode,
        "id": req.body.designId,
        "id": req.body.email_template_id,
        "mailSubject": req.body.mailSubject,
        "title": req.body.delivery_title,
        "emailFromName": "Unkikasha",
        "recipients": req.body.recipients,
        "Name": req.body.Name,
        "email": req.body.email,
        "IssueDate": req.body.IssueDate
    });

    const config = {
        method: 'post',
        url: 'https://b2b.sertifier.com/Detail/AddDetail',
        headers: {
            'api-version': '2.1',
            'secretKey': '690ec5c1593147d9bc092d88a6571e57821bd37aedb2469c832f57b68878974060f49e8d903b47dc9583e9492de6648c8daf6c324d304c1c8bf67691a44e5f32',
            'Content-Type': 'application/json'
        },
        data: data
    };
    axios(config)
        .then(function (responseCreate) {

            if (responseCreate.data.hasError) {
                res.status(400).json({ message: "validation error", errors: responseCreate.data.validationErrors });
            } else {

                var data = JSON.stringify({

                    "type": req.body.type,
                    "title": req.body.title,
                    "description": req.body.description,
                    "expireDate": req.body.expireDate,
                    "duration": req.body.duration,
                    "durationType": req.body.durationType,
                    "durationNumber": req.body.durationNumber,
                    "cost": req.body.cost,
                    "level": req.body.level,

                });

                var config1 = {
                    method: 'post',
                    url: 'https://b2b.sertifier.com/Detail/AddDetail',
                    headers: {
                        'secretKey': '690ec5c1593147d9bc092d88a6571e57821bd37aedb2469c832f57b68878974060f49e8d903b47dc9583e9492de6648c8daf6c324d304c1c8bf67691a44e5f32',
                        'api-version': '2.1',
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
                axios(config1)

                    .then(function (responseAdddetail) {
                        var data = JSON.stringify({
                            "title": req.body.title,
                            "mailSubject": req.body.mailSubject,
                            "designId": req.body.designId,
                            "emailTemplateId": req.body.emailTemplateId,
                            "detailId": responseCreate.data.data.id,
                            "emailFromName": "Unkikasha"
                        });

                        const config2 = {
                            method: 'post',
                            url: 'https://b2b.sertifier.com/Delivery/AddDelivery',
                            headers: {
                                'secretKey': '690ec5c1593147d9bc092d88a6571e57821bd37aedb2469c832f57b68878974060f49e8d903b47dc9583e9492de6648c8daf6c324d304c1c8bf67691a44e5f32',
                                'api-version': '2.1',
                                'Content-Type': 'application/json'
                            },
                            data: data
                        };

                        axios(config2)
                            .then(function (responseAdddelivery) {

                                // add recipients start
                                var data = CircularJSON.stringify({
                                    "deliveryId": responseAdddelivery.data.data,
                                    "mailSubject": req.body.mailSubject,
                                    "recipients": req.body.recipients,
                                    "Name": req.body.Name,
                                    "email": req.body.email,
                                    "IssueDate": req.body.IssueDate,
                                    "quickPublish": true

                                })

                                const config3 = {
                                    method: 'post',
                                    url: 'https://b2b.sertifier.com/Delivery/AddRecipients',
                                    headers: {
                                        'secretKey': '690ec5c1593147d9bc092d88a6571e57821bd37aedb2469c832f57b68878974060f49e8d903b47dc9583e9492de6648c8daf6c324d304c1c8bf67691a44e5f32',
                                        'api-version': '2.1',
                                        'Content-Type': 'application/json'
                                    },
                                    data: data
                                };
                                axios(config3)
                                    .then(function (responseAddRecipients) {
                                        // send start
                                        var data = CircularJSON.stringify({
                                            "deliveryId": responseAdddelivery.data.data
                                        })

                                        const config4 = {
                                            method: 'post',
                                            url: 'https://b2b.sertifier.com/Delivery/Send',
                                            headers: {
                                                'secretKey': '690ec5c1593147d9bc092d88a6571e57821bd37aedb2469c832f57b68878974060f49e8d903b47dc9583e9492de6648c8daf6c324d304c1c8bf67691a44e5f32',
                                                'api-version': '2.1',
                                                'Content-Type': 'application/json'
                                            },
                                            data: data
                                        };
                                        axios(config4)
                                            .then(function (responseSend) {
                                            })
                                            .catch(function (error) {
                                                console.log(error);
                                            }); // send end here 

                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                    });
                            })
                    })

            } //else close 
            res.status(200).json({ message: "Create certificate successfully and send to the mail!", data: responseCreate.data });
        })

        .catch(function (error) {
            console.log(error);
        })
})

module.exports = router;
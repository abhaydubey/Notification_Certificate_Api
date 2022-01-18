require('./config/main-config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const timeZone = require('moment-timezone');
const cors = require('cors');
const { Op } = require('sequelize');


const {
    UserController, CertificateController, InvoiceController
} = require('./controllers');

const apiRoute = '/api/v1/';
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    exposedHeaders: ['Content-Disposition']
}));

const generateApiRoute = (route) => `${apiRoute}${route}`;
app.use(generateApiRoute('user'), UserController);
app.use(generateApiRoute('certificate'), CertificateController);
app.use(generateApiRoute('invoice'), InvoiceController);
const env = (process.env.NODE_ENV) ? process.env.NODE_ENV : 'development';
timeZone.tz.setDefault('Asia/Kolkata');
const appListen = app.listen(process.env.PORT, () => {
    console.log(`Server started on port (${process.env.PORT}) in a (${env}) environment`);
});

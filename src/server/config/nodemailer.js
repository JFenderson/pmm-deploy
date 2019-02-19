import nodemailer from 'nodemailer';
import SibApiV3Sdk from 'sib-api-v3-sdk';
import sendinblue from 'nodemailer-sendinblue-transport';
// import mg  from 'nodemailer-mailgun-transport';
import dotenv from 'dotenv';
dotenv.config();


var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'Gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId:process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    }
});

let sendInBlueTransporter = nodemailer.createTransport({
    host: 'smtp-relay.sendinblue.com',
    port: 587,
    service: 'SendinBlue',
    auth:{
        user: process.env.SENDINBLUE_USER,
        pass: process.env.SENDINBLUE_PW
    }
});


export { transporter, sendInBlueTransporter}
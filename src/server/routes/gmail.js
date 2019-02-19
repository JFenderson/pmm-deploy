import nodemailer from 'nodemailer';
import { Router } from 'express';
import { transporter, sendInBlueTransporter} from '../config/nodemailer';
import SibApiV3Sdk from 'sib-api-v3-sdk';
import { formatNumber } from 'libphonenumber-js'
import dotenv from 'dotenv';
dotenv.config();

let router = Router();

router.get('/', (req, res) => {
    res.send('Server working. Please post at "/contact" to submit a message.');
  });
  
router.post('/', (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;
    const mailOption = {
        from: `${name} <${email}>`,// who the email is coming from..in the contact form
        to: 'joseph.fenderson@gmail.com',//who the email is going to
        subject: `New Message from ${email} from the PMM Weekend Site`,//subject line
        text: message,
        html: `<div style="text-align: center; margin: auto; margin-right: auto 0; border: 1px solid; padding: 10px; width: 50%; height: auto;">
        <h1>Hey PMM Admin,</h1> 
        <h1>You have a new message from the PMM Weekend Site</h1>
        <h2>From: ${name}</h2>
        <h2>Message:</h2>
        <h2>${message} </h2>
      </div>`,
    };

    transporter.sendMail(mailOption,(error, res)=> {
        if (error) {
            console.log(error);
        } else {
            console.log('email sent to admin!')
            res.sendStatus(201);
        }
        transporter.close();
    });
});

export default router;


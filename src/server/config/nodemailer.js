import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


let transporter = nodemailer.createTransport({
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


export { transporter, sendInBlueTransporter};
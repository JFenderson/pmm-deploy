// lt --port 8000 to open in localtunnnel
import path from 'path';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from '../../webpack.dev.config.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import '@babel/polyfill';
import stripeLoader from 'stripe';
import dotenv from 'dotenv';
import Table from './utils/table';
import ZipCodes from 'zipcodes';
import human from 'humanparser';
import SibApiV3Sdk from 'sib-api-v3-sdk';
import debug from 'debug';
import chalk from 'chalk';
import request from 'request';

let members = new Table('members');
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_V3;
let contactApiInstance = new SibApiV3Sdk.ContactsApi();
let smtpApiInstance = new SibApiV3Sdk.SMTPApi();

dotenv.config();
const stripe = stripeLoader(process.env.STRIPE_SK);
const app = express(),
	DIST_DIR = __dirname,
	HTML_FILE = path.join(DIST_DIR, '../dist/index.html'),
	compiler = webpack(config),
  errorPg = path.join(DIST_DIR, '../dist/404.html'), //this is your error page
  legal = path.join(DIST_DIR, '../dist/legal/legal.html'),
  privatePolicy = path.join(DIST_DIR, '../dist/legal/privatePolicy.html'),
  cookiesPolicy = path.join(DIST_DIR, '../dist/legal/cookiesPolicy.html'),
  term = path.join(DIST_DIR, '../dist/legal/term.html'),
  returnPolicy = path.join(DIST_DIR, '../dist/legal/return.html')


	if (process.env.NODE_ENV !== 'production') {
		console.log('Looks like we are in development mode!');
	}
 

app.use(webpackDevMiddleware(compiler, {
	publicPath: config.output.publicPath
}));
app.use(webpackHotMiddleware(compiler));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('trust proxy', true);
app.set('trust proxy', 'loopback');
app.use(cors());
app.use(express.static(path.join(__dirname + '../../src')));
app.get('/', (_, res) => {
	res.sendFile(HTML_FILE);
});
app.use(function (req, res, next) {
  console.log(chalk.blue('/' + req.method + '-' + req.url)); //eslint-disable-line no-console
  next();
});

// getting legal html files
app.get('/legal/legal', (_,res) => {
  res.sendFile(legal)
})
app.get('/legal/term', (_,res) => {
  res.sendFile(term)
})
app.get('/legal/privatePolicy', (_,res) => {
  res.sendFile(privatePolicy)
})
app.get('/legal/cookiesPolicy', (_,res) => {
  res.sendFile(cookiesPolicy)
})
app.get('/legal/return', (_,res) => {
  res.sendFile(returnPolicy)
})



//-----USER ROUTES-----
app.get('/members', (req, res) => {
	// res.send({name: "joseph Fenderson", email: "joseph.fenderson@gmail.com"})
	members.getAll()
		.then((member) => {
			return res.json(member);

		})
		.catch((err) => {
			return res.sendStatus(400).json(err);

		});

		var opts = { 
			'limit': 50, // Number | Number of documents per page
			'offset': 0, // Number | Index of the first document of the page
			'modifiedSince': new Date("2013-10-20T19:20:30+01:00") // Date | Filter (urlencoded) the contacts modified after a given UTC date-time (YYYY-MM-DDTHH:mm:ss.SSSZ). Prefer to pass your timezone in date-time format for accurate result.
		};
		contactApiInstance.getContacts(opts).then(function(data) {
			console.log('API called successfully. Returned data: ' + data);
		}, function(error) {
			console.error(error);
		});
});

app.get('/members/:id', (req, res) => {
	let id = req.params.id;
	members.getOne(id)
		.then((member) => {
			return res.json(member);
		})
		.catch((err) => {
			return res.sendStatus(400).send(err);

		});
});

app.post('/members/signup', (req, res) => {
	let { email, phoneNumber, crabYear } = req.body;
	let name = human.parseName(req.body.name);
	let location = ZipCodes.lookup(req.body.location);

	let data = {
		firstName: name.firstName,
		lastName: name.lastName,
		email: email,
		phoneNumber: phoneNumber,
		city: location.city,
		state: location.state,
		crabYear: crabYear
	};

	members.insert({
		first_name: data.firstName,
		last_name: data.lastName,
		email: data.email,
		phone_number: data.phoneNumber,
		city: data.city,
		state: data.state,
		crab_year: data.crabYear
	})
		.then((member) => {
			return res.status(201).send(member);

		})
		.catch((err) => {
			return res.status(400).send(err);
		});


	//creates the contact
	let createContact = new SibApiV3Sdk.CreateContact();
	createContact = {
		'email': data.email,
		'attributes': {
			'FIRSTNAME': data.firstName,
			'LASTNAME': data.lastName,
			'phone': data.phoneNumber
		}
	};
	contactApiInstance.createContact(createContact)
		.then((data) => {
			return data;
		})
		.catch((err) => {
			new Error(err);
		});

		var contactEmails = new SibApiV3Sdk.AddContactToList([data.email]); // AddContactToList | Emails addresses of the contacts

		contactApiInstance.addContactToList(5, contactEmails).then(function(data) {
			console.log('API called successfully. Returned data: ' + data);
		}, function(error) {
			console.error(error);
		});

	const mailOption = {
		'sender': { 'name': 'PMM Admin', 'email': 'purplemarchingmachinepicnic96@gmail.com' },// who the email is coming from..in the contact form
		'to': [{
			'FIRSTNAME': `${name.firstName}`,
			'LASTNAME': `${name.lastName}`,
			'email': `${email}`
		}],
		'subject': 'Thank you for Signing Up to the PMM Database',//subject line
		'templateId': 3
	};

	let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
	sendSmtpEmail = mailOption;
	
	smtpApiInstance.sendTransacEmail(sendSmtpEmail)
		.then(function (data) {
			return data;
		})
		.catch((err) => {
			return new Error(err);
		});

});
//----STRIPE ROUTES-----
//1 CHILD TICKET
app.post('/tickets/chld/1', (req, res) => {
	let token = req.body.id;
	let email = req.body.email;
	let name = req.body.card.name;

 return stripe.customers.create({
			source: token,
			email: email,
	}).then(customer => {
			stripe.charges.create({
					amount: 500,
					currency: 'usd',
					description: 'For PMM Weekend - 1 child ticket',
					customer: customer.id,
					receipt_email: customer.email,
			}); 
	}).then(charge => {
			res.send(charge);
						//SENDING email
			var mailOption = {
					from: `fenderson.joseph@gmail.com`,
					to: `${name} <${email}>`,
					subject: 'PMM Weekend Purchase',
					text: 'Thank you for you Payment..See you at PMM Weekend!'
					};
			
					transporter.sendMail(mailOption,(error, res)=> {
							if (error) {
									console.log(error);
							} else {
									console.log('email sent!')
									res.sendStatus(201);
							}
							transporter.close();
					});
	})
	.catch(function onError(error) {
			if (error.status === 400) {
				res.send({error: 'Bad request, often due to missing a required parameter.'});
			} else if (error.status === 401) {
				console.log('No valid API key provided.');
			} else if (error.status === 404) {
				console.log('The requested resource doesn\'t exist.');
			} else if(error.status === 500){
					console.log('Purchase Failed')
			}
		});
	});
//2 CHILDREN TICKETS
app.post('/tickets/chld/2', (req, res) => {
	let token = req.body.id;
	let email = req.body.email;
	let name = req.body.card.name;

 return stripe.customers.create({
			source: token,
			email: email,
	}).then(customer => {
			stripe.charges.create({
					amount: 1000,
					currency: 'usd',
					description: 'For PMM Weekend - 2 child ticket',
					customer: customer.id,
					receipt_email: customer.email,
			}); 
	}).then(charge => {
			res.send(charge);
						//SENDING email
			var mailOption = {
					from: `fenderson.joseph@gmail.com`,
					to: `${name} <${email}>`,
					subject: 'PMM Weekend Purchase',
					text: 'Thank you for you Payment..See you at PMM Weekend!'
					};
			
					transporter.sendMail(mailOption,(error, res)=> {
							if (error) {
									console.log(error);
							} else {
									console.log('email sent!')
									res.sendStatus(201);
							}
							transporter.close();
					});
	})
	.catch(function onError(error) {
			if (error.status === 400) {
				res.send({error: 'Bad request, often due to missing a required parameter.'});
			} else if (error.status === 401) {
				console.log('No valid API key provided.');
			} else if (error.status === 404) {
				console.log('The requested resource doesn\'t exist.');
			} else if(error.status === 500){
					console.log('Purchase Failed')
			}
		});
	})
//3 CHILDREN TICKETS
app.post('/tickets/chld/3', (req, res) => {
	let token = req.body.id;
	let email = req.body.email;
	let name = req.body.card.name;

 return stripe.customers.create({
			source: token,
			email: email,
	}).then(customer => {
			stripe.charges.create({
					amount: 1000,
					currency: 'usd',
					description: 'For PMM Weekend - 3 child ticket',
					customer: customer.id,
					receipt_email: customer.email,
			}); 
	}).then(charge => {
			res.send(charge);
						//SENDING email
			var mailOption = {
					from: `fenderson.joseph@gmail.com`,
					to: `${name} <${email}>`,
					subject: 'PMM Weekend Purchase',
					text: 'Thank you for you Payment..See you at PMM Weekend!'
					};
			
					transporter.sendMail(mailOption,(error, res)=> {
							if (error) {
									console.log(error);
							} else {
									console.log('email sent!')
									res.sendStatus(201);
							}
							transporter.close();
					});
	})
	.catch(function onError(error) {
			if (error.status === 400) {
				res.send({error: 'Bad request, often due to missing a required parameter.'});
			} else if (error.status === 401) {
				console.log('No valid API key provided.');
			} else if (error.status === 404) {
				console.log('The requested resource doesn\'t exist.');
			} else if(error.status === 500){
					console.log('Purchase Failed')
			}
		});
	})
//1 WEEKEND BUNDLE $30.00
app.post('/tickets/bundle/1', (req, res) => {
	let token = req.body.id;
	let email = req.body.email;
	let name = req.body.card.name;

 return stripe.customers.create({
			source: token,
			email: email,
	}).then(customer => {
			stripe.charges.create({
					amount: 3000,
					currency: 'usd',
					description: 'For PMM Weekend Bundle',
					customer: customer.id,
					receipt_email: customer.email,
			}); 
	}).then(charge => {
			res.send(charge);
						//SENDING email
			var mailOption = {
					from: `fenderson.joseph@gmail.com`,
					to: `${name} <${email}>`,
					subject: 'PMM Weekend Purchase',
					text: 'Thank you for you Payment..See you at PMM Weekend!'
					};
			
					transporter.sendMail(mailOption,(error, res)=> {
							if (error) {
									console.log(error);
							} else {
									console.log('email sent!')
									res.sendStatus(201);
							}
							transporter.close();
					});
	})
	.catch(function onError(error) {
			if (error.status === 400) {
				res.send({error: 'Bad request, often due to missing a required parameter.'});
			} else if (error.status === 401) {
				console.log('No valid API key provided.');
			} else if (error.status === 404) {
				console.log('The requested resource doesn\'t exist.');
			} else if(error.status === 500){
					console.log('Purchase Failed')
			}
		});
})
//2 WEEKEND BUNDLE $60.00
app.post('/tickets/bundle/2', (req, res) => {
	let token = req.body.id;
	let email = req.body.email;
	let name = req.body.card.name;

 return stripe.customers.create({
			source: token,
			email: email,
	}).then(customer => {
			stripe.charges.create({
					amount: 3000,
					currency: 'usd',
					description: 'For PMM Weekend 2 Bundles',
					customer: customer.id,
					receipt_email: customer.email,
			}); 
	}).then(charge => {
			res.send(charge);
						//SENDING email
			var mailOption = {
					from: `fenderson.joseph@gmail.com`,
					to: `${name} <${email}>`,
					subject: 'PMM Weekend Purchase',
					text: 'Thank you for you Payment..See you at PMM Weekend!'
					};
			
					transporter.sendMail(mailOption,(error, res)=> {
							if (error) {
									console.log(error);
							} else {
									console.log('email sent!')
									res.sendStatus(201);
							}
							transporter.close();
					});
	})
	.catch(function onError(error) {
			if (error.status === 400) {
				res.send({error: 'Bad request, often due to missing a required parameter.'});
			} else if (error.status === 401) {
				console.log('No valid API key provided.');
			} else if (error.status === 404) {
				console.log('The requested resource doesn\'t exist.');
			} else if(error.status === 500){
					console.log('Purchase Failed')
			}
		});
})
//1 INDIVIDUAL TICKET 10.00
app.post('/charge/tickets/idv/1', (req, res) => {
	let token = req.body.id;
	let email = req.body.email;
	let name = req.body.card.name;

	return stripe.customers.create({
		source: token,
		email: email,
	}).then((customer) => {
		stripe.charges.create({
			amount: 1000,
			currency: 'usd',
			description: 'For PMM Weekend - 1 ticket',
			customer: customer.id,
			receipt_email: customer.email,
		});
	}).then((charge) => {
		res.send(charge);
		//SENDING email
		let mailOption = {
			from: 'fenderson.joseph@gmail.com',
			to: `${name} <${email}>`,
			subject: 'PMM Weekend Purchase',
			text: 'Thank you for you Payment..See you at PMM Weekend!'
		};

		let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
		sendSmtpEmail = mailOption;
		smtpApiInstance.sendTransacEmail(sendSmtpEmail)
			.then(function (data) {
				return data;
			})
			.catch((err) => {
				return new Error(err);
			});
	})
		.catch(function onError(error) {
			if (error.status === 400) {
				res.send({ error: 'Bad request, often due to missing a required parameter.' });
			} else if (error.status === 401) {
				res.send({ error: 'No valid API key provided.' });
			} else if (error.status === 404) {
				res.send({ error: 'The requested resource doesn\'t exist.' });
			} else if (error.status === 500) {
				res.send({ error: 'Purchase Failed' });
			}
		});

});

//2 INDIVIDUAL TICKET 20.00
app.post('/charge/tickets/idv/2', (req, res) => {
	let token = req.body.id;
	let email = req.body.email;
	let name = req.body.card.name;

	return stripe.customers.create({
		source: token,
		email: email,
	}).then((customer) => {
		stripe.charges.create({
			amount: 2000,
			currency: 'usd',
			description: 'For PMM Weekend - 2 tickets',
			customer: customer.id,
			receipt_email: customer.email,
		});
	}).then((charge) => {
		res.send(charge);
		//SENDING email
		let mailOption = {
			from: 'fenderson.joseph@gmail.com',
			to: `${name} <${email}>`,
			subject: 'PMM Weekend Purchase',
			text: 'Thank you for you Payment..See you at PMM Weekend!'
		};

		let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
		sendSmtpEmail = mailOption;
		smtpApiInstance.sendTransacEmail(sendSmtpEmail)
			.then(function (data) {
				return data;
			})
			.catch((err) => {
				return new Error(err);
			});

	})
		.catch(function onError(error) {
			if (error.status === 400) {
				res.send({ error: 'Bad request, often due to missing a required parameter.' });
			} else if (error.status === 401) {
				res.send({ error: 'No valid API key provided.' });
			} else if (error.status === 404) {
				res.send({ error: 'The requested resource doesn\'t exist.' });
			} else if (error.status === 500) {
				res.send({ error: 'Purchase Failed' });
			}
		});
});

//3 INDIVIDUAL TICKET 30.00
app.post('/charge/tickets/idv/3', (req, res) => {
	let token = req.body.id;
	let email = req.body.email;
	let name = req.body.card.name;

	return stripe.customers.create({
		source: token,
		email: email,
	}).then((customer) => {
		stripe.charges.create({
			amount: 3000,
			currency: 'usd',
			description: 'For PMM Weekend - 3 tickets',
			customer: customer.id,
			receipt_email: customer.email,
		});
	}).then((charge) => {
		res.send(charge);

		let mailOption = {
			from: 'fenderson.joseph@gmail.com',
			to: `${name} <${email}>`,
			subject: 'PMM Weekend Purchase',
			text: 'Thank you for you Payment..See you at PMM Weekend!'
		};

		let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
		sendSmtpEmail = mailOption;
		smtpApiInstance.sendTransacEmail(sendSmtpEmail)
			.then(function (data) {
				return data;
			})
			.catch((err) => {
				return new Error(err);
			});
	})
		.catch(function onError(error) {
			if (error.status === 400) {
				res.send({ error: 'Bad request, often due to missing a required parameter.' });
			} else if (error.status === 401) {
				res.send({ error: 'No valid API key provided.' });
			} else if (error.status === 404) {
				res.send({ error: 'The requested resource doesn\'t exist.' });
			} else if (error.status === 500) {
				res.send({ error: 'Purchase Failed' });
			}
		});
});
//4 INDIVIDUAL TICKET 40.00
app.post('/charge/tickets/idv/4', (req, res) => {
	let token = req.body.id;
	let email = req.body.email;
	let name = req.body.card.name;

	return stripe.customers.create({
		source: token,
		email: email,
	}).then((customer) => {
		stripe.charges.create({
			amount: 4000,
			currency: 'usd',
			description: 'For PMM Weekend - 4 tickets',
			customer: customer.id,
			receipt_email: customer.email,
		});
	}).then((charge) => {
		res.send(charge);

		let mailOption = {
			from: 'fenderson.joseph@gmail.com',
			to: `${name} <${email}>`,
			subject: 'PMM Weekend Purchase',
			text: 'Thank you for you Payment..See you at PMM Weekend!'
		};

		let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
		sendSmtpEmail = mailOption;
		smtpApiInstance.sendTransacEmail(sendSmtpEmail)
			.then(function (data) {
				return data;
			})
			.catch((err) => {
				return new Error(err);
			});
	})
		.catch(function onError(error) {
			if (error.status === 400) {
				res.send({ error: 'Bad request, often due to missing a required parameter.' });
			} else if (error.status === 401) {
				res.send({ error: 'No valid API key provided.' });
			} else if (error.status === 404) {
				res.send({ error: 'The requested resource doesn\'t exist.' });
			} else if (error.status === 500) {
				res.send({ error: 'Purchase Failed' });
			}
		});
});
//5 INDIVIDUAL TICKET 50.00
app.post('/charge/tickets/idv/5', (req, res) => {
	let token = req.body.id;
	let email = req.body.email;
	let name = req.body.card.name;

	return stripe.customers.create({
		source: token,
		email: email,
	}).then((customer) => {
		stripe.charges.create({
			amount: 5000,
			currency: 'usd',
			description: 'For PMM Weekend - 5 tickets',
			customer: customer.id,
			receipt_email: customer.email,
		});
	}).then((charge) => {
		res.send(charge);

		let mailOption = {
			from: 'fenderson.joseph@gmail.com',
			to: `${name} <${email}>`,
			subject: 'PMM Weekend Purchase',
			text: 'Thank you for you Payment..See you at PMM Weekend!'
		};

		let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
		sendSmtpEmail = mailOption;
		smtpApiInstance.sendTransacEmail(sendSmtpEmail)
			.then(function (data) {
				return data;
			})
			.catch((err) => {
				return new Error(err);
			});
	})
		.catch(function onError(error) {
			if (error.status === 400) {
				res.send({ error: 'Bad request, often due to missing a required parameter.' });
			} else if (error.status === 401) {
				res.send({ error: 'No valid API key provided.' });
			} else if (error.status === 404) {
				res.send({ error: 'The requested resource doesn\'t exist.' });
			} else if (error.status === 500) {
				res.send({ error: 'Purchase Failed' });
			}
		});
});

//TENT SPACE PURCHASE 1
app.post('/charge/tickets/tntsp/1', (req, res) => {
	let token = req.body.id;
	let email = req.body.email;
	let name = req.body.card.name;

	return stripe.customers.create({
		source: token,
		email: email,
	}).then((customer) => {
		stripe.charges.create({
			amount: 10000,
			currency: 'usd',
			description: 'For PMM Weekend - 1 tent space',
			customer: customer.id,
			receipt_email: customer.email,
		});
	}).then((charge) => {
		res.send(charge);

		let mailOption = {
			from: 'fenderson.joseph@gmail.com',
			to: `${name} <${email}>`,
			subject: 'PMM Weekend Purchase',
			text: 'Thank you for you Payment..See you at PMM Weekend!'
		};

		let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
		sendSmtpEmail = mailOption;
		smtpApiInstance.sendTransacEmail(sendSmtpEmail)
			.then(function (data) {
				return data;
			})
			.catch((err) => {
				return new Error(err);
			});
	})
		.catch(function onError(error) {
			if (error.status === 400) {
				res.send({ error: 'Bad request, often due to missing a required parameter.' });
			} else if (error.status === 401) {
				res.send({ error: 'No valid API key provided.' });
			} else if (error.status === 404) {
				res.send({ error: 'The requested resource doesn\'t exist.' });
			} else if (error.status === 500) {
				res.send({ error: 'Purchase Failed' });
			}
		});
});

//TENT SPACE PURCHASE 2
app.post('/charge/tickets/tntsp/2', (req, res) => {
	let token = req.body.id;
	let email = req.body.email;
	let name = req.body.card.name;

	return stripe.customers.create({
		source: token,
		email: email,
	}).then((customer) => {
		stripe.charges.create({
			amount: 20000,
			currency: 'usd',
			description: 'For PMM Weekend - 2 tent spaces',
			customer: customer.id,
			receipt_email: customer.email,
		});
	}).then((charge) => {
		res.send(charge);

		let mailOption = {
			from: 'fenderson.joseph@gmail.com',
			to: `${name} <${email}>`,
			subject: 'PMM Weekend Purchase',
			text: 'Thank you for you Payment..See you at PMM Weekend!'
		};

		let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
		sendSmtpEmail = mailOption;
		smtpApiInstance.sendTransacEmail(sendSmtpEmail)
			.then(function (data) {
				return data;
			})
			.catch((err) => {
				return new Error(err);
			});
	})
		.catch(function onError(error) {
			if (error.status === 400) {
				res.send({ error: 'Bad request, often due to missing a required parameter.' });
			} else if (error.status === 401) {
				res.send({ error: 'No valid API key provided.' });
			} else if (error.status === 404) {
				res.send({ error: 'The requested resource doesn\'t exist.' });
			} else if (error.status === 500) {
				res.send({ error: 'Purchase Failed' });
			}
		});


});

//TENT SPACE PURCHASE 3
app.post('/charge/tickets/tntsp/3', (req, res) => {
	let token = req.body.id;
	let email = req.body.email;
	let name = req.body.card.name;

	return stripe.customers.create({
		source: token,
		email: email,
	}).then((customer) => {
		stripe.charges.create({
			amount: 30000,
			currency: 'usd',
			description: 'For PMM Weekend - 3 tent spaces',
			customer: customer.id,
			receipt_email: customer.email,
		});
	}).then((charge) => {
		res.send(charge);

		let mailOption = {
			from: 'fenderson.joseph@gmail.com',
			to: `${name} <${email}>`,
			subject: 'PMM Weekend Purchase',
			text: 'Thank you for you Payment..See you at PMM Weekend!'
		};

		let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
		sendSmtpEmail = mailOption;
		smtpApiInstance.sendTransacEmail(sendSmtpEmail)
			.then(function (data) {
				return data;
			})
			.catch((err) => {
				return new Error(err);
			});
	})
		.catch(function onError(error) {
			if (error.status === 400) {
				res.send({ error: 'Bad request, often due to missing a required parameter.' });
			} else if (error.status === 401) {
				res.send({ error: 'No valid API key provided.' });
			} else if (error.status === 404) {
				res.send({ error: 'The requested resource doesn\'t exist.' });
			} else if (error.status === 500) {
				res.send({ error: 'Purchase Failed' });
			}
		});
});
//--------CONTACT EMAIL ROUTES ------
app.get('/contact', (req, res) => {
	res.send('Server working. Please post at "/contact" to submit a message.');
});

app.post('/contact', (req) => {

	const name = req.body.name;
	const email = req.body.email;
	const message = req.body.message;
	const mailOption = {
		'sender': {
			'name': `${name}` ,'email': `${email}`},// who the email is coming from..in the contact form
		'to':[{
			'email': 'purplemarchingmachinepicnic96@gmail.com'
		}],//who the email is going to
		'subject': `New Message from ${email} from the PMM Weekend Site`,//subject line
		'textContent': message,
		'htmlContent': `<div style="text-align: center; margin: auto; margin-right: auto 0; border: 1px solid; padding: 10px; width: 50%; height: auto;">
      <h1>Hey PMM Admin,</h1> 
      <h1>You have a new message from the PMM Weekend Site</h1>
      <h2>From: ${name}</h2>
      <h2>Message:</h2>
      <h2>${message} </h2>
    </div>`,
	};

	let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email
	sendSmtpEmail = mailOption;
	smtpApiInstance.sendTransacEmail(sendSmtpEmail)
		.then(function (data) {
			return data;
		})
		.catch((err) => {
			return new Error(err);
		});
});

//catch all endpoint will be Error Page
app.use('*', function (req, res) {
	res.sendStatus(404).sendFile(errorPg);
});

debug('booting %o PMM Weekend server');

http.createServer(app).listen(process.env.PORT || 5000);

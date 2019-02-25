import { Router } from 'express';
import stripeLoader from 'stripe';
import { transporter } from '../config/nodemailer';
import dotenv from 'dotenv';
dotenv.config();

let router = Router();
const stripe = stripeLoader(process.env.STRIPE_SK);

//1 INDIVIDUAL TICKET 10.00
router.post('/tickets/idv/1', (req, res) => {
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

		transporter.sendMail(mailOption, (error, res) => {
			if (error) {
				return new Error(error);
			} else {
				res.sendStatus(201).send(`email sent to ${email}!`);
			}
			transporter.close();
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
router.post('/tickets/idv/2', (req, res) => {
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

		transporter.sendMail(mailOption, (error, res) => {
			if (error) {
				return new Error(error);
			} else {
				res.sendStatus(201).send(`email sent to ${email}!`);
			}
			transporter.close();
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
router.post('/tickets/idv/3', (req, res) => {
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

		transporter.sendMail(mailOption, (error, res) => {
			if (error) {
				return new Error(error);
			} else {
				res.sendStatus(201).send(`email sent to ${email}!`);
			}
			transporter.close();
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
router.post('/tickets/idv/4', (req, res) => {
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

		transporter.sendMail(mailOption, (error, res) => {
			if (error) {
				return new Error(error);
			} else {
				res.sendStatus(201).send(`email sent to ${email}!`);
			}
			transporter.close();
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
router.post('/tickets/idv/5', (req, res) => {
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

		transporter.sendMail(mailOption, (error, res) => {
			if (error) {
				return new Error(error);
			} else {
				res.sendStatus(201).send(`email sent to ${email}!`);
			}
			transporter.close();
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
router.post('/tickets/tntsp/1', (req, res) => {
	let token = req.body.id;
	let email = req.body.email;
	let name = req.body.card.name;

	return stripe.customers.create({
		source: token,
		email: email,
	}).then((customer) => {
		stripe.charges.create({
			amount: 12000,
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

		transporter.sendMail(mailOption, (error, res) => {
			if (error) {
				return new Error(error);
			} else {
				res.sendStatus(201).send(`email sent to ${email}!`);
			}
			transporter.close();
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
router.post('/tickets/tntsp/2', (req, res) => {
	let token = req.body.id;
	let email = req.body.email;
	let name = req.body.card.name;

	return stripe.customers.create({
		source: token,
		email: email,
	}).then((customer) => {
		stripe.charges.create({
			amount: 24000,
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

		transporter.sendMail(mailOption, (error, res) => {
			if (error) {
				return new Error(error);
			} else {
				res.sendStatus(201).send(`email sent to ${email}!`);
			}
			transporter.close();
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
router.post('/tickets/tntsp/3', (req, res) => {
	let token = req.body.id;
	let email = req.body.email;
	let name = req.body.card.name;

	return stripe.customers.create({
		source: token,
		email: email,
	}).then((customer) => {
		stripe.charges.create({
			amount: 36000,
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

		transporter.sendMail(mailOption, (error, res) => {
			if (error) {
				return new Error(error);
			} else {
				res.sendStatus(201).send(`email sent to ${email}!`);
			}
			transporter.close();
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
export default router;
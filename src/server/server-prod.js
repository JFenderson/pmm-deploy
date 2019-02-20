// lt --port 8000 to open in localtunnnel
import path from 'path'
import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import config from '../../webpack.dev.config.js'
import routes from './routes/index'
import cors from 'cors'
import bodyParser from 'body-parser'
import http from 'http';
import https from 'https';
import fs from 'fs';
import request from 'request'
import '@babel/polyfill'
import stripeLoader from 'stripe';
import { transporter, sendInBlueTransporter, mailgunTransporter } from './config/nodemailer';
import dotenv from 'dotenv';
import Table from './utils/table';
import ZipCodes from 'zipcodes';
import human from 'humanparser';
import SibApiV3Sdk from 'sib-api-v3-sdk'
import nodemailer from 'nodemailer';
import { formatNumber } from 'libphonenumber-js'

let members = new Table('members');
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_V3;
dotenv.config();
const stripe = stripeLoader(process.env.STRIPE_SK); 

const app = express(),
            DIST_DIR = __dirname,
            HTML_FILE = path.join(DIST_DIR, '../dist/index.html'),
            compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath
}))
app.use(webpackHotMiddleware(compiler))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.set('trust proxy', true);
app.set('trust proxy', 'loopback');
app.use(cors())
app.use(express.static(path.join(__dirname + '../../src')));
app.use(express.static(path.join(__dirname + '../vendors')));
app.get('*', (_ ,res) => {
  res.sendFile(HTML_FILE);
})
// app.use('/api', routes);
//-----USER ROUTES-----
app.get('/members', (req, res) => {
  members.getAll()
  .then(member => {
    return res.json(member)
    
  })
  .catch(err => {
    return res.sendStatus(400).json(err)
    
  })
})

app.get('/members/:id', (req, res) => {
  let id = req.params.id;
  members.getOne(id)
  .then(member => {
    return res.json(member)
  })
  .catch(err => {
    return res.sendStatus(400)
    
  })
})

app.post('/members/signup', (req, res) => {
  let { email, phoneNumber, crabYear} = req.body;
  let name = human.parseName(req.body.name);
  let location = ZipCodes.lookup(req.body.location);
  var apiInstance = new SibApiV3Sdk.ContactsApi();
  var createContact = new SibApiV3Sdk.CreateContact(email);
  var contactEmails = new SibApiV3Sdk.AddContactToList(email); // AddContactToList | Emails addresses of the contacts
 
  let data = {
    firstName: name.firstName,
    lastName: name.lastName,
    email: email,
    phoneNumber: phoneNumber,
    city: location.city,
    state: location.state,
    crabYear: crabYear
  }

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
    return res.status(201).send(member)
    
  })
  .catch((err) => {
    return res.status(400).send(err)
  })


  var options = { "email": email,
  "attributes": {
    "FName": data.firstName,
    "LName": data.lastName,
    "phone": data.phoneNumber
  }};

  // var createContact = new SibApiV3Sdk.CreateContact();
  // request(options, function (error, response, body) {
  //   if (error) throw new Error(error);

  //   console.log(body);
  // });

  // apiInstance.addContactToList(contactEmails)
  // .then(function(data) {
  //   console.log('API called successfully. Returned data: ' + data);
  // }, function(error) {
  //   console.error(error);
  // });

  // apiInstance.createContact(options)
  // .then((data) => {
  //   return data;
  // })
  // .catch((err) => {
  //   new Error(err)
  // })
    

  const mailOption = {
    from: `fenderson.joseph@gmail.com`,// who the email is coming from..in the contact form
    to: `${name} <${email}>`,//who the email is going to
    subject: `Thank you for Signing Up to the PMM Weekend Site`,//subject line
    html: `
    <div style="text-align: center;">
      <h1>Hello <span style="color: purple;">${name.firstName} ${name.lastName}</span>,</h1> 
      <h2>Thank you signing up. You have been added to the PMM Database which will be used to contact you for future events such as road trips to support the band, band schedules and more currently in the works.</h2>
      <h3>Our goal is to build and get every person that marched as PMM in our database so that we can have a directory. With your help we can get there so spread the word to sign up from the website.</h3>
      <h1 style="color: purple"><span style="color: gold;">P</span>MM 1X!!!</h1>
      <p>If you do not wish to be contacted please repond to this email saying <strong>"PLEASE REMOVE"</strong> and you will be removed from the listing.</p>
    </div>`,
};

transporter.sendMail(mailOption,(error, res)=> {
  if (error) {
      console.log(error);
  } else {
      console.log(`email sent to ${email}!`)
      res.sendStatus(201);
  }
  transporter.close();
})

})
//----STRIPE ROUTES-----
//1 INDIVIDUAL TICKET 10.00
app.post('/charge/tickets/idv/1', (req, res) => {
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
          description: 'For PMM Weekend - 1 ticket',
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

//2 INDIVIDUAL TICKET 20.00
app.post('/charge/tickets/idv/2', (req, res) => {
  let token = req.body.id;
  let email = req.body.email;
  let name = req.body.card.name;

  console.log(req.body);

  return stripe.customers.create({
      source: token,
      email: email,
  }).then(customer => {
      stripe.charges.create({
          amount: 2000,
          currency: 'usd',
          description: 'For PMM Weekend - 2 tickets',
          customer: customer.id,
          receipt_email: customer.email,
      }); 
  }).then((charge) => {
      res.send(charge)
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
        console.log('Bad request, often due to missing a required parameter.');
      } else if (error.status === 401) {
        console.log('No valid API key provided.');
      } else if (error.status === 404) {
        console.log('The requested resource doesn\'t exist.');
      } else if(error.status === 500){
          console.log('Purchase Failed')
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
  }).then(customer => {
      stripe.charges.create({
          amount: 3000,
          currency: 'usd',
          description: 'For PMM Weekend - 3 tickets',
          customer: customer.id,
          receipt_email: customer.email,
      }); 
  }).then((charge) => {
      res.send(charge)
            
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
        console.log('Bad request, often due to missing a required parameter.');
      } else if (error.status === 401) {
        console.log('No valid API key provided.');
      } else if (error.status === 404) {
        console.log('The requested resource doesn\'t exist.');
      } else if(error.status === 500){
          console.log('Purchase Failed')
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
  }).then(customer => {
      stripe.charges.create({
          amount: 4000,
          currency: 'usd',
          description: 'For PMM Weekend - 4 tickets',
          customer: customer.id,
          receipt_email: customer.email,
      }); 
  }).then((charge) => {
      res.send(charge)
            
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
        console.log('Bad request, often due to missing a required parameter.');
      } else if (error.status === 401) {
        console.log('No valid API key provided.');
      } else if (error.status === 404) {
        console.log('The requested resource doesn\'t exist.');
      } else if(error.status === 500){
          console.log('Purchase Failed')
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
  }).then(customer => {
      stripe.charges.create({
          amount: 5000,
          currency: 'usd',
          description: 'For PMM Weekend - 5 tickets',
          customer: customer.id,
          receipt_email: customer.email,
      }); 
  }).then((charge) => {
      res.send(charge)
            
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
        console.log('Bad request, often due to missing a required parameter.');
      } else if (error.status === 401) {
        console.log('No valid API key provided.');
      } else if (error.status === 404) {
        console.log('The requested resource doesn\'t exist.');
      } else if(error.status === 500){
          console.log('Purchase Failed')
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
  }).then(customer => {
      stripe.charges.create({
          amount: 12000,
          currency: 'usd',
          description: 'For PMM Weekend - 1 tent space',
          customer: customer.id,
          receipt_email: customer.email,
      }); 
  }).then((charge) => {
      res.send(charge)
            
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
        console.log('Bad request, often due to missing a required parameter.');
      } else if (error.status === 401) {
        console.log('No valid API key provided.');
      } else if (error.status === 404) {
        console.log('The requested resource doesn\'t exist.');
      } else if(error.status === 500){
          console.log('Purchase Failed')
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
  }).then(customer => {
      stripe.charges.create({
          amount: 24000,
          currency: 'usd',
          description: 'For PMM Weekend - 2 tent spaces',
          customer: customer.id,
          receipt_email: customer.email,
      }); 
  }).then((charge) => {
      res.send(charge)
            
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
        console.log('Bad request, often due to missing a required parameter.');
      } else if (error.status === 401) {
        console.log('No valid API key provided.');
      } else if (error.status === 404) {
        console.log('The requested resource doesn\'t exist.');
      } else if(error.status === 500){
          console.log('Purchase Failed')
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
  }).then(customer => {
      stripe.charges.create({
          amount: 36000,
          currency: 'usd',
          description: 'For PMM Weekend - 3 tent spaces',
          customer: customer.id,
          receipt_email: customer.email,
      }); 
  }).then((charge) => {
      res.send(charge)
            
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
        console.log('Bad request, often due to missing a required parameter.');
      } else if (error.status === 401) {
        console.log('No valid API key provided.');
      } else if (error.status === 404) {
        console.log('The requested resource doesn\'t exist.');
      } else if(error.status === 500){
          console.log('Purchase Failed')
      }
    });
});
//--------CONTACT EMAIL ROUTES ------
app.get('/contact', (req, res) => {
  res.send('Server working. Please post at "/contact" to submit a message.');
});

app.post('/contact', (req, res) => {

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


app.set('trust proxy', function (ip) {
  if (ip === '127.0.0.1' || ip === '159.65.231.212' || ip === '0.0.0.0') return true // trusted IPs
  else return false
})



http.createServer(app).listen(process.env.PORT || 5000);

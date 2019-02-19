import { Router } from 'express';
import Table from '../utils/table';
import ZipCodes from 'zipcodes';
import human from 'humanparser';
import dotenv from 'dotenv';
import SibApiV3Sdk from 'sib-api-v3-sdk'
import request from 'request';
import { transporter, sendInBlueTransporter, mailgunTransporter} from '../config/nodemailer';
dotenv.config();

let router = Router();
let members = new Table('members');
let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.SENDINBLUE_V3;


router.get('/', (req, res) => {
  members.getAll()
  .then(member => {
    return res.json(member)
    
  })
  .catch(err => {
    return res.sendStatus(400).json(err)
    
  })
})

router.get('/:id', (req, res) => {
  let id = req.params.id;
  members.getOne(id)
  .then(member => {
    return res.json(member)
  })
  .catch(err => {
    return res.sendStatus(400)
    
  })
})

router.post('/signup', (req, res) => {
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

export default router;
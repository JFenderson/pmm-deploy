/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/server/server-prod.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/server/config/db.js":
/*!*********************************!*\
  !*** ./src/server/config/db.js ***!
  \*********************************/
/*! exports provided: row, rows, empty, executeQuery, generatePlaceholders */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"row\", function() { return row; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"rows\", function() { return rows; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"empty\", function() { return empty; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"executeQuery\", function() { return executeQuery; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"generatePlaceholders\", function() { return generatePlaceholders; });\n/* harmony import */ var mysql__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mysql */ \"mysql\");\n/* harmony import */ var mysql__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mysql__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! dotenv */ \"dotenv\");\n/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(dotenv__WEBPACK_IMPORTED_MODULE_1__);\n\n\ndotenv__WEBPACK_IMPORTED_MODULE_1___default.a.config();\nvar pool = mysql__WEBPACK_IMPORTED_MODULE_0___default.a.createPool({\n  connectionLimit: 10,\n  host: process.env.MYSQL_HOST,\n  user: process.env.MYSQL_USER,\n  password: process.env.MYSQL_PASSWORD,\n  database: process.env.MYSQL_DATABASE,\n  port: 3306\n});\n\nfunction executeQuery(sql) {\n  var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];\n  return getConnection().then(function (connection) {\n    return new Promise(function (resolve, reject) {\n      connection.query(sql, args, function (err, result) {\n        connection.release();\n\n        if (err) {\n          reject(err);\n        } else {\n          resolve(result);\n        }\n      });\n    });\n  });\n}\n\nfunction callProcedure(procedureName) {\n  var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];\n  var placeholders = generatePlaceholders(args);\n  var callString = \"CALL \".concat(procedureName, \"(\").concat(placeholders, \");\");\n  return executeQuery(callString, args);\n}\n\nfunction rows(procedureName) {\n  var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];\n  return callProcedure(procedureName, args).then(function (resultsets) {\n    return resultsets[0];\n  });\n}\n\nfunction row(procedureName) {\n  var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];\n  return callProcedure(procedureName, args).then(function (resultsets) {\n    return resultsets[0][0];\n  });\n}\n\nfunction empty(procedureName) {\n  var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];\n  return callProcedure(procedureName, args).then(function () {\n    return;\n  });\n}\n\nfunction generatePlaceholders() {\n  var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];\n  var placeholders = '';\n\n  if (args.length > 0) {\n    for (var i = 0; i < args.length; i++) {\n      if (i === args.length - 1) {\n        // if we are on the last argument in the array\n        placeholders += '?';\n      } else {\n        placeholders += '?,';\n      }\n    }\n  }\n\n  return placeholders;\n}\n\nfunction getConnection() {\n  return new Promise(function (resolve, reject) {\n    pool.getConnection(function (err, connection) {\n      if (err) {\n        reject(err);\n      } else {\n        resolve(connection);\n      }\n    });\n  });\n}\n\n\n\n//# sourceURL=webpack:///./src/server/config/db.js?");

/***/ }),

/***/ "./src/server/server-prod.js":
/*!***********************************!*\
  !*** ./src/server/server-prod.js ***!
  \***********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var webpack__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! webpack */ \"webpack\");\n/* harmony import */ var webpack__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(webpack__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! webpack-dev-middleware */ \"webpack-dev-middleware\");\n/* harmony import */ var webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var webpack_hot_middleware__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! webpack-hot-middleware */ \"webpack-hot-middleware\");\n/* harmony import */ var webpack_hot_middleware__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(webpack_hot_middleware__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var _webpack_dev_config_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../webpack.dev.config.js */ \"./webpack.dev.config.js\");\n/* harmony import */ var _webpack_dev_config_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_webpack_dev_config_js__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! cors */ \"cors\");\n/* harmony import */ var cors__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(cors__WEBPACK_IMPORTED_MODULE_6__);\n/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! body-parser */ \"body-parser\");\n/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(body_parser__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! http */ \"http\");\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_8__);\n/* harmony import */ var _babel_polyfill__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @babel/polyfill */ \"@babel/polyfill\");\n/* harmony import */ var _babel_polyfill__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_babel_polyfill__WEBPACK_IMPORTED_MODULE_9__);\n/* harmony import */ var stripe__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! stripe */ \"stripe\");\n/* harmony import */ var stripe__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(stripe__WEBPACK_IMPORTED_MODULE_10__);\n/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! dotenv */ \"dotenv\");\n/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(dotenv__WEBPACK_IMPORTED_MODULE_11__);\n/* harmony import */ var _utils_table__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./utils/table */ \"./src/server/utils/table.js\");\n/* harmony import */ var zipcodes__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! zipcodes */ \"zipcodes\");\n/* harmony import */ var zipcodes__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(zipcodes__WEBPACK_IMPORTED_MODULE_13__);\n/* harmony import */ var humanparser__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! humanparser */ \"humanparser\");\n/* harmony import */ var humanparser__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(humanparser__WEBPACK_IMPORTED_MODULE_14__);\n/* harmony import */ var sib_api_v3_sdk__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! sib-api-v3-sdk */ \"sib-api-v3-sdk\");\n/* harmony import */ var sib_api_v3_sdk__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(sib_api_v3_sdk__WEBPACK_IMPORTED_MODULE_15__);\n/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! debug */ \"debug\");\n/* harmony import */ var debug__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(debug__WEBPACK_IMPORTED_MODULE_16__);\n/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! chalk */ \"chalk\");\n/* harmony import */ var chalk__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(chalk__WEBPACK_IMPORTED_MODULE_17__);\n/* harmony import */ var request__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! request */ \"request\");\n/* harmony import */ var request__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(request__WEBPACK_IMPORTED_MODULE_18__);\n// lt --port 8000 to open in localtunnnel\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nvar members = new _utils_table__WEBPACK_IMPORTED_MODULE_12__[\"default\"]('members');\nvar defaultClient = sib_api_v3_sdk__WEBPACK_IMPORTED_MODULE_15___default.a.ApiClient.instance;\nvar apiKey = defaultClient.authentications['api-key'];\napiKey.apiKey = process.env.SENDINBLUE_V3;\nvar contactApiInstance = new sib_api_v3_sdk__WEBPACK_IMPORTED_MODULE_15___default.a.ContactsApi();\nvar smtpApiInstance = new sib_api_v3_sdk__WEBPACK_IMPORTED_MODULE_15___default.a.SMTPApi();\ndotenv__WEBPACK_IMPORTED_MODULE_11___default.a.config();\nvar stripe = stripe__WEBPACK_IMPORTED_MODULE_10___default()(process.env.STRIPE_SK);\nvar app = express__WEBPACK_IMPORTED_MODULE_1___default()(),\n    DIST_DIR = __dirname,\n    HTML_FILE = path__WEBPACK_IMPORTED_MODULE_0___default.a.join(DIST_DIR, '../dist/index.html'),\n    compiler = webpack__WEBPACK_IMPORTED_MODULE_2___default()(_webpack_dev_config_js__WEBPACK_IMPORTED_MODULE_5___default.a),\n    errorPg = path__WEBPACK_IMPORTED_MODULE_0___default.a.join(DIST_DIR, '../dist/404.html'),\n    //this is your error page\nlegal = path__WEBPACK_IMPORTED_MODULE_0___default.a.join(DIST_DIR, '../dist/legal/legal.html'),\n    privatePolicy = path__WEBPACK_IMPORTED_MODULE_0___default.a.join(DIST_DIR, '../dist/legal/privatePolicy.html'),\n    cookiesPolicy = path__WEBPACK_IMPORTED_MODULE_0___default.a.join(DIST_DIR, '../dist/legal/cookiesPolicy.html'),\n    term = path__WEBPACK_IMPORTED_MODULE_0___default.a.join(DIST_DIR, '../dist/legal/term.html'),\n    returnPolicy = path__WEBPACK_IMPORTED_MODULE_0___default.a.join(DIST_DIR, '../dist/legal/return.html');\n\nif (true) {\n  console.log('Looks like we are in development mode!');\n}\n\napp.use(webpack_dev_middleware__WEBPACK_IMPORTED_MODULE_3___default()(compiler, {\n  publicPath: _webpack_dev_config_js__WEBPACK_IMPORTED_MODULE_5___default.a.output.publicPath\n}));\napp.use(webpack_hot_middleware__WEBPACK_IMPORTED_MODULE_4___default()(compiler));\napp.use(body_parser__WEBPACK_IMPORTED_MODULE_7___default.a.json());\napp.use(body_parser__WEBPACK_IMPORTED_MODULE_7___default.a.urlencoded({\n  extended: false\n}));\napp.set('trust proxy', true);\napp.set('trust proxy', 'loopback');\napp.use(cors__WEBPACK_IMPORTED_MODULE_6___default()());\napp.use(express__WEBPACK_IMPORTED_MODULE_1___default.a.static(path__WEBPACK_IMPORTED_MODULE_0___default.a.join(__dirname + '../../src')));\napp.get('/', function (_, res) {\n  res.sendFile(HTML_FILE);\n});\napp.use(function (req, res, next) {\n  console.log(chalk__WEBPACK_IMPORTED_MODULE_17___default.a.blue('/' + req.method + '-' + req.url)); //eslint-disable-line no-console\n\n  next();\n}); // getting legal html files\n\napp.get('/legal/legal', function (_, res) {\n  res.sendFile(legal);\n});\napp.get('/legal/term', function (_, res) {\n  res.sendFile(term);\n});\napp.get('/legal/privatePolicy', function (_, res) {\n  res.sendFile(privatePolicy);\n});\napp.get('/legal/cookiesPolicy', function (_, res) {\n  res.sendFile(cookiesPolicy);\n});\napp.get('/legal/return', function (_, res) {\n  res.sendFile(returnPolicy);\n}); //-----USER ROUTES-----\n\napp.get('/members', function (req, res) {\n  // res.send({name: \"joseph Fenderson\", email: \"joseph.fenderson@gmail.com\"})\n  members.getAll().then(function (member) {\n    return res.json(member);\n  }).catch(function (err) {\n    return res.sendStatus(400).json(err);\n  });\n  var opts = {\n    'limit': 50,\n    // Number | Number of documents per page\n    'offset': 0,\n    // Number | Index of the first document of the page\n    'modifiedSince': new Date(\"2013-10-20T19:20:30+01:00\") // Date | Filter (urlencoded) the contacts modified after a given UTC date-time (YYYY-MM-DDTHH:mm:ss.SSSZ). Prefer to pass your timezone in date-time format for accurate result.\n\n  };\n  contactApiInstance.getContacts(opts).then(function (data) {\n    console.log('API called successfully. Returned data: ' + data);\n  }, function (error) {\n    console.error(error);\n  });\n});\napp.get('/members/:id', function (req, res) {\n  var id = req.params.id;\n  members.getOne(id).then(function (member) {\n    return res.json(member);\n  }).catch(function (err) {\n    return res.sendStatus(400).send(err);\n  });\n});\napp.post('/members/signup', function (req, res) {\n  var _req$body = req.body,\n      email = _req$body.email,\n      phoneNumber = _req$body.phoneNumber,\n      crabYear = _req$body.crabYear;\n  var name = humanparser__WEBPACK_IMPORTED_MODULE_14___default.a.parseName(req.body.name);\n  var location = zipcodes__WEBPACK_IMPORTED_MODULE_13___default.a.lookup(req.body.location);\n  var data = {\n    firstName: name.firstName,\n    lastName: name.lastName,\n    email: email,\n    phoneNumber: phoneNumber,\n    city: location.city,\n    state: location.state,\n    crabYear: crabYear\n  };\n  members.insert({\n    first_name: data.firstName,\n    last_name: data.lastName,\n    email: data.email,\n    phone_number: data.phoneNumber,\n    city: data.city,\n    state: data.state,\n    crab_year: data.crabYear\n  }).then(function (member) {\n    return res.status(201).send(member);\n  }).catch(function (err) {\n    return res.status(400).send(err);\n  }); //creates the contact\n\n  var createContact = new sib_api_v3_sdk__WEBPACK_IMPORTED_MODULE_15___default.a.CreateContact();\n  createContact = {\n    'email': data.email,\n    'attributes': {\n      'FIRSTNAME': data.firstName,\n      'LASTNAME': data.lastName,\n      'phone': data.phoneNumber\n    }\n  };\n  contactApiInstance.createContact(createContact).then(function (data) {\n    return data;\n  }).catch(function (err) {\n    new Error(err);\n  });\n  var contactEmails = new sib_api_v3_sdk__WEBPACK_IMPORTED_MODULE_15___default.a.AddContactToList([data.email]); // AddContactToList | Emails addresses of the contacts\n\n  contactApiInstance.addContactToList(5, contactEmails).then(function (data) {\n    console.log('API called successfully. Returned data: ' + data);\n  }, function (error) {\n    console.error(error);\n  });\n  var mailOption = {\n    'sender': {\n      'name': 'PMM Admin',\n      'email': 'purplemarchingmachinepicnic96@gmail.com'\n    },\n    // who the email is coming from..in the contact form\n    'to': [{\n      'FIRSTNAME': \"\".concat(name.firstName),\n      'LASTNAME': \"\".concat(name.lastName),\n      'email': \"\".concat(email)\n    }],\n    'subject': 'Thank you for Signing Up to the PMM Database',\n    //subject line\n    'templateId': 3\n  };\n  var sendSmtpEmail = new sib_api_v3_sdk__WEBPACK_IMPORTED_MODULE_15___default.a.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email\n\n  sendSmtpEmail = mailOption;\n  smtpApiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {\n    return data;\n  }).catch(function (err) {\n    return new Error(err);\n  });\n}); //----STRIPE ROUTES-----\n//1 CHILD TICKET\n\napp.post('/tickets/chld/1', function (req, res) {\n  var token = req.body.id;\n  var email = req.body.email;\n  var name = req.body.card.name;\n  return stripe.customers.create({\n    source: token,\n    email: email\n  }).then(function (customer) {\n    stripe.charges.create({\n      amount: 500,\n      currency: 'usd',\n      description: 'For PMM Weekend - 1 child ticket',\n      customer: customer.id,\n      receipt_email: customer.email\n    });\n  }).then(function (charge) {\n    res.send(charge); //SENDING email\n\n    var mailOption = {\n      from: \"fenderson.joseph@gmail.com\",\n      to: \"\".concat(name, \" <\").concat(email, \">\"),\n      subject: 'PMM Weekend Purchase',\n      text: 'Thank you for you Payment..See you at PMM Weekend!'\n    };\n    transporter.sendMail(mailOption, function (error, res) {\n      if (error) {\n        console.log(error);\n      } else {\n        console.log('email sent!');\n        res.sendStatus(201);\n      }\n\n      transporter.close();\n    });\n  }).catch(function onError(error) {\n    if (error.status === 400) {\n      res.send({\n        error: 'Bad request, often due to missing a required parameter.'\n      });\n    } else if (error.status === 401) {\n      console.log('No valid API key provided.');\n    } else if (error.status === 404) {\n      console.log('The requested resource doesn\\'t exist.');\n    } else if (error.status === 500) {\n      console.log('Purchase Failed');\n    }\n  });\n}); //2 CHILDREN TICKETS\n\napp.post('/tickets/chld/2', function (req, res) {\n  var token = req.body.id;\n  var email = req.body.email;\n  var name = req.body.card.name;\n  return stripe.customers.create({\n    source: token,\n    email: email\n  }).then(function (customer) {\n    stripe.charges.create({\n      amount: 1000,\n      currency: 'usd',\n      description: 'For PMM Weekend - 2 child ticket',\n      customer: customer.id,\n      receipt_email: customer.email\n    });\n  }).then(function (charge) {\n    res.send(charge); //SENDING email\n\n    var mailOption = {\n      from: \"fenderson.joseph@gmail.com\",\n      to: \"\".concat(name, \" <\").concat(email, \">\"),\n      subject: 'PMM Weekend Purchase',\n      text: 'Thank you for you Payment..See you at PMM Weekend!'\n    };\n    transporter.sendMail(mailOption, function (error, res) {\n      if (error) {\n        console.log(error);\n      } else {\n        console.log('email sent!');\n        res.sendStatus(201);\n      }\n\n      transporter.close();\n    });\n  }).catch(function onError(error) {\n    if (error.status === 400) {\n      res.send({\n        error: 'Bad request, often due to missing a required parameter.'\n      });\n    } else if (error.status === 401) {\n      console.log('No valid API key provided.');\n    } else if (error.status === 404) {\n      console.log('The requested resource doesn\\'t exist.');\n    } else if (error.status === 500) {\n      console.log('Purchase Failed');\n    }\n  });\n}); //3 CHILDREN TICKETS\n\napp.post('/tickets/chld/3', function (req, res) {\n  var token = req.body.id;\n  var email = req.body.email;\n  var name = req.body.card.name;\n  return stripe.customers.create({\n    source: token,\n    email: email\n  }).then(function (customer) {\n    stripe.charges.create({\n      amount: 1000,\n      currency: 'usd',\n      description: 'For PMM Weekend - 3 child ticket',\n      customer: customer.id,\n      receipt_email: customer.email\n    });\n  }).then(function (charge) {\n    res.send(charge); //SENDING email\n\n    var mailOption = {\n      from: \"fenderson.joseph@gmail.com\",\n      to: \"\".concat(name, \" <\").concat(email, \">\"),\n      subject: 'PMM Weekend Purchase',\n      text: 'Thank you for you Payment..See you at PMM Weekend!'\n    };\n    transporter.sendMail(mailOption, function (error, res) {\n      if (error) {\n        console.log(error);\n      } else {\n        console.log('email sent!');\n        res.sendStatus(201);\n      }\n\n      transporter.close();\n    });\n  }).catch(function onError(error) {\n    if (error.status === 400) {\n      res.send({\n        error: 'Bad request, often due to missing a required parameter.'\n      });\n    } else if (error.status === 401) {\n      console.log('No valid API key provided.');\n    } else if (error.status === 404) {\n      console.log('The requested resource doesn\\'t exist.');\n    } else if (error.status === 500) {\n      console.log('Purchase Failed');\n    }\n  });\n}); //1 WEEKEND BUNDLE $30.00\n\napp.post('/tickets/bundle/1', function (req, res) {\n  var token = req.body.id;\n  var email = req.body.email;\n  var name = req.body.card.name;\n  return stripe.customers.create({\n    source: token,\n    email: email\n  }).then(function (customer) {\n    stripe.charges.create({\n      amount: 3000,\n      currency: 'usd',\n      description: 'For PMM Weekend Bundle',\n      customer: customer.id,\n      receipt_email: customer.email\n    });\n  }).then(function (charge) {\n    res.send(charge); //SENDING email\n\n    var mailOption = {\n      from: \"fenderson.joseph@gmail.com\",\n      to: \"\".concat(name, \" <\").concat(email, \">\"),\n      subject: 'PMM Weekend Purchase',\n      text: 'Thank you for you Payment..See you at PMM Weekend!'\n    };\n    transporter.sendMail(mailOption, function (error, res) {\n      if (error) {\n        console.log(error);\n      } else {\n        console.log('email sent!');\n        res.sendStatus(201);\n      }\n\n      transporter.close();\n    });\n  }).catch(function onError(error) {\n    if (error.status === 400) {\n      res.send({\n        error: 'Bad request, often due to missing a required parameter.'\n      });\n    } else if (error.status === 401) {\n      console.log('No valid API key provided.');\n    } else if (error.status === 404) {\n      console.log('The requested resource doesn\\'t exist.');\n    } else if (error.status === 500) {\n      console.log('Purchase Failed');\n    }\n  });\n}); //2 WEEKEND BUNDLE $60.00\n\napp.post('/tickets/bundle/2', function (req, res) {\n  var token = req.body.id;\n  var email = req.body.email;\n  var name = req.body.card.name;\n  return stripe.customers.create({\n    source: token,\n    email: email\n  }).then(function (customer) {\n    stripe.charges.create({\n      amount: 3000,\n      currency: 'usd',\n      description: 'For PMM Weekend 2 Bundles',\n      customer: customer.id,\n      receipt_email: customer.email\n    });\n  }).then(function (charge) {\n    res.send(charge); //SENDING email\n\n    var mailOption = {\n      from: \"fenderson.joseph@gmail.com\",\n      to: \"\".concat(name, \" <\").concat(email, \">\"),\n      subject: 'PMM Weekend Purchase',\n      text: 'Thank you for you Payment..See you at PMM Weekend!'\n    };\n    transporter.sendMail(mailOption, function (error, res) {\n      if (error) {\n        console.log(error);\n      } else {\n        console.log('email sent!');\n        res.sendStatus(201);\n      }\n\n      transporter.close();\n    });\n  }).catch(function onError(error) {\n    if (error.status === 400) {\n      res.send({\n        error: 'Bad request, often due to missing a required parameter.'\n      });\n    } else if (error.status === 401) {\n      console.log('No valid API key provided.');\n    } else if (error.status === 404) {\n      console.log('The requested resource doesn\\'t exist.');\n    } else if (error.status === 500) {\n      console.log('Purchase Failed');\n    }\n  });\n}); //1 INDIVIDUAL TICKET 10.00\n\napp.post('/charge/tickets/idv/1', function (req, res) {\n  var token = req.body.id;\n  var email = req.body.email;\n  var name = req.body.card.name;\n  return stripe.customers.create({\n    source: token,\n    email: email\n  }).then(function (customer) {\n    stripe.charges.create({\n      amount: 1000,\n      currency: 'usd',\n      description: 'For PMM Weekend - 1 ticket',\n      customer: customer.id,\n      receipt_email: customer.email\n    });\n  }).then(function (charge) {\n    res.send(charge); //SENDING email\n\n    var mailOption = {\n      from: 'fenderson.joseph@gmail.com',\n      to: \"\".concat(name, \" <\").concat(email, \">\"),\n      subject: 'PMM Weekend Purchase',\n      text: 'Thank you for you Payment..See you at PMM Weekend!'\n    };\n    var sendSmtpEmail = new sib_api_v3_sdk__WEBPACK_IMPORTED_MODULE_15___default.a.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email\n\n    sendSmtpEmail = mailOption;\n    smtpApiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {\n      return data;\n    }).catch(function (err) {\n      return new Error(err);\n    });\n  }).catch(function onError(error) {\n    if (error.status === 400) {\n      res.send({\n        error: 'Bad request, often due to missing a required parameter.'\n      });\n    } else if (error.status === 401) {\n      res.send({\n        error: 'No valid API key provided.'\n      });\n    } else if (error.status === 404) {\n      res.send({\n        error: 'The requested resource doesn\\'t exist.'\n      });\n    } else if (error.status === 500) {\n      res.send({\n        error: 'Purchase Failed'\n      });\n    }\n  });\n}); //2 INDIVIDUAL TICKET 20.00\n\napp.post('/charge/tickets/idv/2', function (req, res) {\n  var token = req.body.id;\n  var email = req.body.email;\n  var name = req.body.card.name;\n  return stripe.customers.create({\n    source: token,\n    email: email\n  }).then(function (customer) {\n    stripe.charges.create({\n      amount: 2000,\n      currency: 'usd',\n      description: 'For PMM Weekend - 2 tickets',\n      customer: customer.id,\n      receipt_email: customer.email\n    });\n  }).then(function (charge) {\n    res.send(charge); //SENDING email\n\n    var mailOption = {\n      from: 'fenderson.joseph@gmail.com',\n      to: \"\".concat(name, \" <\").concat(email, \">\"),\n      subject: 'PMM Weekend Purchase',\n      text: 'Thank you for you Payment..See you at PMM Weekend!'\n    };\n    var sendSmtpEmail = new sib_api_v3_sdk__WEBPACK_IMPORTED_MODULE_15___default.a.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email\n\n    sendSmtpEmail = mailOption;\n    smtpApiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {\n      return data;\n    }).catch(function (err) {\n      return new Error(err);\n    });\n  }).catch(function onError(error) {\n    if (error.status === 400) {\n      res.send({\n        error: 'Bad request, often due to missing a required parameter.'\n      });\n    } else if (error.status === 401) {\n      res.send({\n        error: 'No valid API key provided.'\n      });\n    } else if (error.status === 404) {\n      res.send({\n        error: 'The requested resource doesn\\'t exist.'\n      });\n    } else if (error.status === 500) {\n      res.send({\n        error: 'Purchase Failed'\n      });\n    }\n  });\n}); //3 INDIVIDUAL TICKET 30.00\n\napp.post('/charge/tickets/idv/3', function (req, res) {\n  var token = req.body.id;\n  var email = req.body.email;\n  var name = req.body.card.name;\n  return stripe.customers.create({\n    source: token,\n    email: email\n  }).then(function (customer) {\n    stripe.charges.create({\n      amount: 3000,\n      currency: 'usd',\n      description: 'For PMM Weekend - 3 tickets',\n      customer: customer.id,\n      receipt_email: customer.email\n    });\n  }).then(function (charge) {\n    res.send(charge);\n    var mailOption = {\n      from: 'fenderson.joseph@gmail.com',\n      to: \"\".concat(name, \" <\").concat(email, \">\"),\n      subject: 'PMM Weekend Purchase',\n      text: 'Thank you for you Payment..See you at PMM Weekend!'\n    };\n    var sendSmtpEmail = new sib_api_v3_sdk__WEBPACK_IMPORTED_MODULE_15___default.a.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email\n\n    sendSmtpEmail = mailOption;\n    smtpApiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {\n      return data;\n    }).catch(function (err) {\n      return new Error(err);\n    });\n  }).catch(function onError(error) {\n    if (error.status === 400) {\n      res.send({\n        error: 'Bad request, often due to missing a required parameter.'\n      });\n    } else if (error.status === 401) {\n      res.send({\n        error: 'No valid API key provided.'\n      });\n    } else if (error.status === 404) {\n      res.send({\n        error: 'The requested resource doesn\\'t exist.'\n      });\n    } else if (error.status === 500) {\n      res.send({\n        error: 'Purchase Failed'\n      });\n    }\n  });\n}); //4 INDIVIDUAL TICKET 40.00\n\napp.post('/charge/tickets/idv/4', function (req, res) {\n  var token = req.body.id;\n  var email = req.body.email;\n  var name = req.body.card.name;\n  return stripe.customers.create({\n    source: token,\n    email: email\n  }).then(function (customer) {\n    stripe.charges.create({\n      amount: 4000,\n      currency: 'usd',\n      description: 'For PMM Weekend - 4 tickets',\n      customer: customer.id,\n      receipt_email: customer.email\n    });\n  }).then(function (charge) {\n    res.send(charge);\n    var mailOption = {\n      from: 'fenderson.joseph@gmail.com',\n      to: \"\".concat(name, \" <\").concat(email, \">\"),\n      subject: 'PMM Weekend Purchase',\n      text: 'Thank you for you Payment..See you at PMM Weekend!'\n    };\n    var sendSmtpEmail = new sib_api_v3_sdk__WEBPACK_IMPORTED_MODULE_15___default.a.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email\n\n    sendSmtpEmail = mailOption;\n    smtpApiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {\n      return data;\n    }).catch(function (err) {\n      return new Error(err);\n    });\n  }).catch(function onError(error) {\n    if (error.status === 400) {\n      res.send({\n        error: 'Bad request, often due to missing a required parameter.'\n      });\n    } else if (error.status === 401) {\n      res.send({\n        error: 'No valid API key provided.'\n      });\n    } else if (error.status === 404) {\n      res.send({\n        error: 'The requested resource doesn\\'t exist.'\n      });\n    } else if (error.status === 500) {\n      res.send({\n        error: 'Purchase Failed'\n      });\n    }\n  });\n}); //5 INDIVIDUAL TICKET 50.00\n\napp.post('/charge/tickets/idv/5', function (req, res) {\n  var token = req.body.id;\n  var email = req.body.email;\n  var name = req.body.card.name;\n  return stripe.customers.create({\n    source: token,\n    email: email\n  }).then(function (customer) {\n    stripe.charges.create({\n      amount: 5000,\n      currency: 'usd',\n      description: 'For PMM Weekend - 5 tickets',\n      customer: customer.id,\n      receipt_email: customer.email\n    });\n  }).then(function (charge) {\n    res.send(charge);\n    var mailOption = {\n      from: 'fenderson.joseph@gmail.com',\n      to: \"\".concat(name, \" <\").concat(email, \">\"),\n      subject: 'PMM Weekend Purchase',\n      text: 'Thank you for you Payment..See you at PMM Weekend!'\n    };\n    var sendSmtpEmail = new sib_api_v3_sdk__WEBPACK_IMPORTED_MODULE_15___default.a.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email\n\n    sendSmtpEmail = mailOption;\n    smtpApiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {\n      return data;\n    }).catch(function (err) {\n      return new Error(err);\n    });\n  }).catch(function onError(error) {\n    if (error.status === 400) {\n      res.send({\n        error: 'Bad request, often due to missing a required parameter.'\n      });\n    } else if (error.status === 401) {\n      res.send({\n        error: 'No valid API key provided.'\n      });\n    } else if (error.status === 404) {\n      res.send({\n        error: 'The requested resource doesn\\'t exist.'\n      });\n    } else if (error.status === 500) {\n      res.send({\n        error: 'Purchase Failed'\n      });\n    }\n  });\n}); //TENT SPACE PURCHASE 1\n\napp.post('/charge/tickets/tntsp/1', function (req, res) {\n  var token = req.body.id;\n  var email = req.body.email;\n  var name = req.body.card.name;\n  return stripe.customers.create({\n    source: token,\n    email: email\n  }).then(function (customer) {\n    stripe.charges.create({\n      amount: 10000,\n      currency: 'usd',\n      description: 'For PMM Weekend - 1 tent space',\n      customer: customer.id,\n      receipt_email: customer.email\n    });\n  }).then(function (charge) {\n    res.send(charge);\n    var mailOption = {\n      from: 'fenderson.joseph@gmail.com',\n      to: \"\".concat(name, \" <\").concat(email, \">\"),\n      subject: 'PMM Weekend Purchase',\n      text: 'Thank you for you Payment..See you at PMM Weekend!'\n    };\n    var sendSmtpEmail = new sib_api_v3_sdk__WEBPACK_IMPORTED_MODULE_15___default.a.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email\n\n    sendSmtpEmail = mailOption;\n    smtpApiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {\n      return data;\n    }).catch(function (err) {\n      return new Error(err);\n    });\n  }).catch(function onError(error) {\n    if (error.status === 400) {\n      res.send({\n        error: 'Bad request, often due to missing a required parameter.'\n      });\n    } else if (error.status === 401) {\n      res.send({\n        error: 'No valid API key provided.'\n      });\n    } else if (error.status === 404) {\n      res.send({\n        error: 'The requested resource doesn\\'t exist.'\n      });\n    } else if (error.status === 500) {\n      res.send({\n        error: 'Purchase Failed'\n      });\n    }\n  });\n}); //TENT SPACE PURCHASE 2\n\napp.post('/charge/tickets/tntsp/2', function (req, res) {\n  var token = req.body.id;\n  var email = req.body.email;\n  var name = req.body.card.name;\n  return stripe.customers.create({\n    source: token,\n    email: email\n  }).then(function (customer) {\n    stripe.charges.create({\n      amount: 20000,\n      currency: 'usd',\n      description: 'For PMM Weekend - 2 tent spaces',\n      customer: customer.id,\n      receipt_email: customer.email\n    });\n  }).then(function (charge) {\n    res.send(charge);\n    var mailOption = {\n      from: 'fenderson.joseph@gmail.com',\n      to: \"\".concat(name, \" <\").concat(email, \">\"),\n      subject: 'PMM Weekend Purchase',\n      text: 'Thank you for you Payment..See you at PMM Weekend!'\n    };\n    var sendSmtpEmail = new sib_api_v3_sdk__WEBPACK_IMPORTED_MODULE_15___default.a.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email\n\n    sendSmtpEmail = mailOption;\n    smtpApiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {\n      return data;\n    }).catch(function (err) {\n      return new Error(err);\n    });\n  }).catch(function onError(error) {\n    if (error.status === 400) {\n      res.send({\n        error: 'Bad request, often due to missing a required parameter.'\n      });\n    } else if (error.status === 401) {\n      res.send({\n        error: 'No valid API key provided.'\n      });\n    } else if (error.status === 404) {\n      res.send({\n        error: 'The requested resource doesn\\'t exist.'\n      });\n    } else if (error.status === 500) {\n      res.send({\n        error: 'Purchase Failed'\n      });\n    }\n  });\n}); //TENT SPACE PURCHASE 3\n\napp.post('/charge/tickets/tntsp/3', function (req, res) {\n  var token = req.body.id;\n  var email = req.body.email;\n  var name = req.body.card.name;\n  return stripe.customers.create({\n    source: token,\n    email: email\n  }).then(function (customer) {\n    stripe.charges.create({\n      amount: 30000,\n      currency: 'usd',\n      description: 'For PMM Weekend - 3 tent spaces',\n      customer: customer.id,\n      receipt_email: customer.email\n    });\n  }).then(function (charge) {\n    res.send(charge);\n    var mailOption = {\n      from: 'fenderson.joseph@gmail.com',\n      to: \"\".concat(name, \" <\").concat(email, \">\"),\n      subject: 'PMM Weekend Purchase',\n      text: 'Thank you for you Payment..See you at PMM Weekend!'\n    };\n    var sendSmtpEmail = new sib_api_v3_sdk__WEBPACK_IMPORTED_MODULE_15___default.a.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email\n\n    sendSmtpEmail = mailOption;\n    smtpApiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {\n      return data;\n    }).catch(function (err) {\n      return new Error(err);\n    });\n  }).catch(function onError(error) {\n    if (error.status === 400) {\n      res.send({\n        error: 'Bad request, often due to missing a required parameter.'\n      });\n    } else if (error.status === 401) {\n      res.send({\n        error: 'No valid API key provided.'\n      });\n    } else if (error.status === 404) {\n      res.send({\n        error: 'The requested resource doesn\\'t exist.'\n      });\n    } else if (error.status === 500) {\n      res.send({\n        error: 'Purchase Failed'\n      });\n    }\n  });\n}); //--------CONTACT EMAIL ROUTES ------\n\napp.get('/contact', function (req, res) {\n  res.send('Server working. Please post at \"/contact\" to submit a message.');\n});\napp.post('/contact', function (req) {\n  var name = req.body.name;\n  var email = req.body.email;\n  var message = req.body.message;\n  var mailOption = {\n    'sender': {\n      'name': \"\".concat(name),\n      'email': \"\".concat(email)\n    },\n    // who the email is coming from..in the contact form\n    'to': [{\n      'email': 'purplemarchingmachinepicnic96@gmail.com'\n    }],\n    //who the email is going to\n    'subject': \"New Message from \".concat(email, \" from the PMM Weekend Site\"),\n    //subject line\n    'textContent': message,\n    'htmlContent': \"<div style=\\\"text-align: center; margin: auto; margin-right: auto 0; border: 1px solid; padding: 10px; width: 50%; height: auto;\\\">\\n      <h1>Hey PMM Admin,</h1> \\n      <h1>You have a new message from the PMM Weekend Site</h1>\\n      <h2>From: \".concat(name, \"</h2>\\n      <h2>Message:</h2>\\n      <h2>\").concat(message, \" </h2>\\n    </div>\")\n  };\n  var sendSmtpEmail = new sib_api_v3_sdk__WEBPACK_IMPORTED_MODULE_15___default.a.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email\n\n  sendSmtpEmail = mailOption;\n  smtpApiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {\n    return data;\n  }).catch(function (err) {\n    return new Error(err);\n  });\n}); //catch all endpoint will be Error Page\n\napp.use('*', function (req, res) {\n  res.sendStatus(404).sendFile(errorPg);\n});\ndebug__WEBPACK_IMPORTED_MODULE_16___default()('booting %o PMM Weekend server');\nhttp__WEBPACK_IMPORTED_MODULE_8___default.a.createServer(app).listen(process.env.PORT || 5000);\n\n//# sourceURL=webpack:///./src/server/server-prod.js?");

/***/ }),

/***/ "./src/server/utils/table.js":
/*!***********************************!*\
  !*** ./src/server/utils/table.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _config_db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config/db */ \"./src/server/config/db.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\n\nvar Table =\n/*#__PURE__*/\nfunction () {\n  function Table(tableName) {\n    _classCallCheck(this, Table);\n\n    if (!tableName) {\n      throw new TypeError('You must pass a MySQL table name into the Table object constructor.');\n    }\n\n    this.tableName = tableName;\n  }\n\n  _createClass(Table, [{\n    key: \"getOne\",\n    value: function getOne(id) {\n      var sql = \"SELECT * FROM \".concat(this.tableName, \" WHERE id = \").concat(id, \";\");\n      return Object(_config_db__WEBPACK_IMPORTED_MODULE_0__[\"executeQuery\"])(sql, [id]).then(function (results) {\n        return results[0];\n      });\n    }\n  }, {\n    key: \"getAll\",\n    value: function getAll() {\n      var sql = \"SELECT * FROM \".concat(this.tableName);\n      return Object(_config_db__WEBPACK_IMPORTED_MODULE_0__[\"executeQuery\"])(sql);\n    }\n  }, {\n    key: \"find\",\n    value: function find(query) {\n      var columns = Object.keys(query);\n      var values = Object.values(query);\n      var conditions = columns.map(function (columnName) {\n        return \"\".concat(columnName, \" LIKE ?\");\n      });\n      var sql = \"SELECT * FROM \".concat(this.tableName, \" WHERE \").concat(conditions.join(' AND '), \";\");\n      return Object(_config_db__WEBPACK_IMPORTED_MODULE_0__[\"executeQuery\"])(sql, values);\n    }\n  }, {\n    key: \"insert\",\n    value: function insert(row) {\n      var columns = Object.keys(row);\n      var values = Object.values(row);\n      var placeholderString = Object(_config_db__WEBPACK_IMPORTED_MODULE_0__[\"generatePlaceholders\"])(values);\n      var sql = \"INSERT INTO \".concat(this.tableName, \" (\").concat(columns.join(','), \") VALUES (\").concat(placeholderString, \");\");\n      return Object(_config_db__WEBPACK_IMPORTED_MODULE_0__[\"executeQuery\"])(sql, values).then(function (results) {\n        return {\n          id: results.insertId\n        };\n      });\n    }\n  }, {\n    key: \"update\",\n    value: function update(id, row) {\n      var columns = Object.keys(row);\n      var values = Object.values(row);\n      var updates = columns.map(function (columnName) {\n        return \"\".concat(columnName, \" = ?\");\n      });\n      var sql = \"UPDATE \".concat(this.tableName, \" SET \").concat(updates.join(','), \" WHERE id = \").concat(id, \";\");\n      return Object(_config_db__WEBPACK_IMPORTED_MODULE_0__[\"executeQuery\"])(sql, values);\n    }\n  }, {\n    key: \"delete\",\n    value: function _delete(id) {\n      var sql = \"DELETE FROM \".concat(this.tableName, \" WHERE id = \").concat(id);\n      return Object(_config_db__WEBPACK_IMPORTED_MODULE_0__[\"executeQuery\"])(sql);\n    }\n  }]);\n\n  return Table;\n}();\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Table);\n\n//# sourceURL=webpack:///./src/server/utils/table.js?");

/***/ }),

/***/ "./webpack.dev.config.js":
/*!*******************************!*\
  !*** ./webpack.dev.config.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var path = __webpack_require__(/*! path */ \"path\");\n\nvar webpack = __webpack_require__(/*! webpack */ \"webpack\");\n\nvar HtmlWebPackPlugin = __webpack_require__(/*! html-webpack-plugin */ \"html-webpack-plugin\");\n\nmodule.exports = {\n  entry: {\n    main: ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000', '@babel/polyfill', './src/js/index.js']\n  },\n  output: {\n    path: path.join(__dirname, 'dist'),\n    publicPath: '/',\n    filename: '[name].js'\n  },\n  mode: 'development',\n  target: 'web',\n  devtool: '#source-map',\n  externals: {\n    jquery: 'jQuery'\n  },\n  module: {\n    rules: [{\n      enforce: \"pre\",\n      test: /\\.js$/,\n      exclude: /node_modules/,\n      loader: \"eslint-loader\",\n      options: {\n        emitWarning: true,\n        failOnError: false,\n        failOnWarning: false\n      }\n    }, {\n      test: /\\.js$/,\n      exclude: /node_modules/,\n      loader: \"babel-loader\"\n    }, {\n      // Loads the javacript into html template provided.\n      // Entry point is set below in HtmlWebPackPlugin in Plugins \n      test: /\\.html$/,\n      use: [{\n        loader: \"html-loader\" //options: { minimize: true }\n\n      }]\n    }, {\n      test: /\\.css$/,\n      use: ['style-loader', 'css-loader']\n    }, {\n      test: /\\.(sa|sc|c)ss$/,\n      use: ['style-loader', 'css-loader', 'sass-loader']\n    }, {\n      test: /\\.(jpe?g|png|gif|svg)$/i,\n      use: ['file-loader']\n    }]\n  },\n  plugins: [new HtmlWebPackPlugin({\n    template: \"./src/html/index.html\",\n    filename: \"./index.html\",\n    excludeChunks: ['server'],\n    chunks: ['main']\n  }), new webpack.HotModuleReplacementPlugin(), new webpack.NoEmitOnErrorsPlugin()]\n};\n\n//# sourceURL=webpack:///./webpack.dev.config.js?");

/***/ }),

/***/ "@babel/polyfill":
/*!**********************************!*\
  !*** external "@babel/polyfill" ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@babel/polyfill\");\n\n//# sourceURL=webpack:///external_%22@babel/polyfill%22?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");\n\n//# sourceURL=webpack:///external_%22body-parser%22?");

/***/ }),

/***/ "chalk":
/*!************************!*\
  !*** external "chalk" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"chalk\");\n\n//# sourceURL=webpack:///external_%22chalk%22?");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cors\");\n\n//# sourceURL=webpack:///external_%22cors%22?");

/***/ }),

/***/ "debug":
/*!************************!*\
  !*** external "debug" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"debug\");\n\n//# sourceURL=webpack:///external_%22debug%22?");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"dotenv\");\n\n//# sourceURL=webpack:///external_%22dotenv%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "html-webpack-plugin":
/*!**************************************!*\
  !*** external "html-webpack-plugin" ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"html-webpack-plugin\");\n\n//# sourceURL=webpack:///external_%22html-webpack-plugin%22?");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"http\");\n\n//# sourceURL=webpack:///external_%22http%22?");

/***/ }),

/***/ "humanparser":
/*!******************************!*\
  !*** external "humanparser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"humanparser\");\n\n//# sourceURL=webpack:///external_%22humanparser%22?");

/***/ }),

/***/ "mysql":
/*!************************!*\
  !*** external "mysql" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mysql\");\n\n//# sourceURL=webpack:///external_%22mysql%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "request":
/*!**************************!*\
  !*** external "request" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"request\");\n\n//# sourceURL=webpack:///external_%22request%22?");

/***/ }),

/***/ "sib-api-v3-sdk":
/*!*********************************!*\
  !*** external "sib-api-v3-sdk" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"sib-api-v3-sdk\");\n\n//# sourceURL=webpack:///external_%22sib-api-v3-sdk%22?");

/***/ }),

/***/ "stripe":
/*!*************************!*\
  !*** external "stripe" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"stripe\");\n\n//# sourceURL=webpack:///external_%22stripe%22?");

/***/ }),

/***/ "webpack":
/*!**************************!*\
  !*** external "webpack" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"webpack\");\n\n//# sourceURL=webpack:///external_%22webpack%22?");

/***/ }),

/***/ "webpack-dev-middleware":
/*!*****************************************!*\
  !*** external "webpack-dev-middleware" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"webpack-dev-middleware\");\n\n//# sourceURL=webpack:///external_%22webpack-dev-middleware%22?");

/***/ }),

/***/ "webpack-hot-middleware":
/*!*****************************************!*\
  !*** external "webpack-hot-middleware" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"webpack-hot-middleware\");\n\n//# sourceURL=webpack:///external_%22webpack-hot-middleware%22?");

/***/ }),

/***/ "zipcodes":
/*!***************************!*\
  !*** external "zipcodes" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"zipcodes\");\n\n//# sourceURL=webpack:///external_%22zipcodes%22?");

/***/ })

/******/ });
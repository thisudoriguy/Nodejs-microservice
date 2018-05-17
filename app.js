// =======================
// get the packages we need ============
// =======================
const  express     = require('express');
const  app         = express();
const  bodyParser  = require('body-parser');
const  morgan      = require('morgan');
const  mongoose    = require('mongoose');

const  jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
const  config = require('./config'); // get our config file
const router = require('./services/auth/index')

// =======================
// configuration =========
// =======================
const port = process.env.PORT || 8080; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret constiable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

// =======================
// routes ================
// =======================
// basic route
app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// apply the routes to our application with the prefix /api
app.use('/api', router);


// =======================
// start the server ======
// =======================
app.listen(port);
console.log('Server running on http://localhost:' + port);
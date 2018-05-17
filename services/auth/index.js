const User = require('./models/user'); // get our mongoose model
// API ROUTES -------------------

// get an instance of the router for api routes
const express = require('express');
const router = express.Router();

// TODO: route to authenticate a user (POST http://localhost:8080/api/authenticate)
// route to authenticate a user (POST http://localhost:8080/api/authenticate)
router.post('/authenticate', function (req, res) {

	// find the user
	User.findOne({
		name: req.body.name
	}, function (err, user) {

		if (err) throw err;

		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {

			// check if password matches
			if (user.password != req.body.password) {
				res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			} else {

				// if user is found and password is right
				// create a token with only our given payload
				// we don't want to pass in the entire user since that has the password
				const payload = {
					admin: user.admin
				};
				const token = jwt.sign(payload, app.get('superSecret'), {
					expiresInMinutes: 1440 // expires in 24 hours
				});

				// return the information including token as JSON
				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}

		}

	});
});

// TODO: route middleware to verify a token
router.use(function (req, res, next) {

	// check header or url parameters or post parameters for token
	const token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function (err, decoded) {
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});

	}
});

// route to show a random message (GET http://localhost:8080/api/)
router.get('/', function (req, res) {
	res.json({ message: 'Welcome to the coolest API on earth!' });
});

router.get('/setup', function (req, res) {

	// create a sample user
	const user = new User({
		name: 'Udori Ekpin',
		password: 'password',
		admin: true
	});

	// save the sample user
	user.save(function (err) {
		if (err) throw err;

		console.log('User saved successfully');
		res.json({ success: true });
	});
});

// route to return all users (GET http://localhost:8080/api/users)
router.get('/users', function (req, res) {
	User.find({}, function (err, users) {
		res.json(users);
	});
});


module.exports = router;


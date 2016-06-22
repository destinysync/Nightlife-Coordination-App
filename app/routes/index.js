'use strict';

var path = process.cwd();
var ClickHandler = require(path + '/app/controllers/clickHandler.server.js');

module.exports = function(app, passport) {

	// function isLoggedIn (req, res, next) {
	// 	if (req.isAuthenticated()) {
	// 		return next();
	// 	} else {
	// 		res.redirect('/login');
	// 	}
	// }

	var clickHandler = new ClickHandler();

	app.route('/')
		// .get(function (req, res) {
		// 	res.render(path + '/public/ejs/nightLifeIndex.ejs');
		// });
		.get(clickHandler.cookiesParser);

	app.route('/login')
		.get(function(req, res) {
			console.log("Cookies :  ", req.cookies);
			res.render(path + '/public/ejs/login.ejs');
		});

	app.route('/logout')
		.get(function(req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/auth/local')
		.post(passport.authenticate('local', {
				failureRedirect: '/login'
			}),
			function(req, res) {
				res.redirect('/');
			});

	app.route('/register/local')
		.post(passport.authenticate('signup', {
			successRedirect: '/',
			failureRedirect: '/login',
			failureFlash: true
		}))
		.get(function(req, res) {
			res.render(process.cwd() + '/public/ejs/register.ejs');
		});

	app.route('/search')
		.post(clickHandler.cookiesParser);

	app.route('/searchResult/*')
		.post(clickHandler.searchResult);

	app.route('/logginViaTwitter')
		.post(passport.authenticate('twitter'))
		.get(passport.authenticate('twitter'));

	app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));

	app.route('/ifLoggedIn')
		.post(clickHandler.ifLoggedIn);

	app.route('/iAmGoing/*')
		.post(clickHandler.iAmGoing);
};

'use strict';

var GitHubStrategy = require('passport-github').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/users');
var configAuth = require('./auth');

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	passport.use(new GitHubStrategy({
		clientID: 'configAuth.githubAuth.clientID',
		clientSecret: 'configAuth.githubAuth.clientSecret',
		callbackURL: 'configAuth.githubAuth.callbackURL'
	},
	function (token, refreshToken, profile, done) {
		process.nextTick(function () {
			User.findOne({ 'github.id': profile.id }, function (err, user) {
				if (err) {
					return done(err);
				}

				if (user) {
					return done(null, user);
				} else {
					var newUser = new User();

					newUser.github.id = profile.id;
					newUser.github.username = profile.username;
					newUser.github.displayName = profile.displayName;
					newUser.github.publicRepos = profile._json.public_repos;
					newUser.nbrClicks.clicks = 0;

					newUser.save(function (err) {
						if (err) {
							throw err;
						}

						return done(null, newUser);
					});
				}
			});
		});
	}));
	
	passport.use(new TwitterStrategy({
			consumerKey: "SDiTmlCZyeZ5g40EqHx8rY3d2",
			consumerSecret: "Vkt41njeZHUOQyJ2OUC5nFuaalZfvbzdQA1mSWjuCfm3BDW4Lf",
			callbackURL: "https://nightlife-coordinate.herokuapp.com/auth/twitter/callback"
		},
		function (token, refreshToken, profile, done) {
			process.nextTick(function () {
				User.findOne({ 'twitter.id': profile.id }, function (err, user) {
					if (err) {
						return done(err);
					}

					if (user) {
						return done(null, user);
					} else {
						var newUser = new User();

						newUser.twitter.id = profile.id;
						newUser.twitter.username = profile.username;
						newUser.twitter.displayName = profile.displayName;
						newUser.twitter.barsToGo = [];

						newUser.save(function (err) {
							if (err) {
								throw err;
							}

							return done(null, newUser);
						});
					}
				});
			});
		}));

	passport.use(new LocalStrategy( {
			passReqToCallback: true
	},
		function(req, username, password, done) {
			User.findOne({ 'local.id': username }, function (err, user) {
				if (err) { return done(err); }
				if (!user) { return done(null, false); }
				if (user.local.password != password) { return done(null, false); }
				return done(null, user);
			});
		}
	));

	passport.use('signup', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done) {
			var findOrCreateUser = function(){
				// find a user in Mongo with provided username
				User.findOne({'local.id':username},function(err, user) {
					// In case of any error return
					if (err){
						console.log('Error in SignUp: '+err);
						return done(err);
					}
					// already exists
					if (user) {
						console.log('User already exists');
						return done(null, false,
							req.flash('message','User Already Exists'));
					} else {
						// if there is no user with that email
						// create the user
						var newUser = new User();
						// set the user's local credentials
						newUser.username = username;
						newUser.password = password;
						// save the user
						newUser.save(function(err) {
							if (err){
								console.log('Error in Saving user: '+err);
								throw err;
							}
							console.log('User Registration successful');
							return done(null, newUser);
						});
					}
				});
			};

			// Delay the execution of findOrCreateUser and execute
			// the method in the next tick of the event loop
			process.nextTick(findOrCreateUser);
		})
	);
};

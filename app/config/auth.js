'use strict';

module.exports = {
	'githubAuth': {
		'clientID': process.env.GITHUB_KEY,
		'clientSecret': process.env.GITHUB_SECRET,
		'callbackURL': process.env.APP_URL + 'auth/github/callback'
	},
	'twitterAuth': {
		'consumerKey': process.env.Twitter_ConsumerKey,
		'consumerSecret': process.env.Twitter_ConsumerSecret,
		'callbackURL': process.env.APP_URL + "auth/twitter/callback"
	}
};

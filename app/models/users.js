'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
	github: {
		id: String,
		displayName: String,
		username: String,
		publicRepos: Number
	},
	local: {
		id: String,
		password: String
	},
	twitter: {
		id: String,
		displayName: String,
		username: String,
		barsToGo: Array
	},
	goingCount: {
		barID: String,
		goingCount: Number
	}
});

module.exports = mongoose.model('User', User);

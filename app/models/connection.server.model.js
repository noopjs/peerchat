'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Device Schema
 */
var ConnectionSchema = new Schema({
	pid: String,
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	name: String,
	expiry: {
		type: Date,
		expires: 0
	}
});
mongoose.model('Connection', ConnectionSchema);

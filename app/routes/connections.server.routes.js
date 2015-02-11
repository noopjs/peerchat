'use strict';

module.exports = function(app) {
	var connections = require('../../app/controllers/connections.server.controller');


	// Devices Routes
	app.route('/connections')
		.get(connections.list)
		.post(connections.create);

	app.route('/connections/:connectionId')
		.put(connections.keepAlive)
		.delete(connections.delete)
		;

	// Finish by binding the Device middleware
	app.param('connectionId', connections.connectionByID);
};

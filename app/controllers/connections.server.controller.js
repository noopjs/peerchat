'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    User = mongoose.model('User'),
    Connection = mongoose.model('Connection');



exports.connectionByID = function(req, res, next, id) {
    Connection.findById(id).exec(function(err, connection) {
        if (err)
            return next(err);
        if (!connection)
            return next(new Error('Couldn\'t find connection ID.'));
        req.pconnection = connection;
        next();
    });
};

exports.list = function(req, res) {
    Connection.find({}).exec(function(err, connections) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(connections);
        }
    });
};
exports.create = function(req, res) {
    var connection = new Connection(req.body);
    connection.expiry = Date.now() + 5*60*1000;
    connection.save(function(err, connection) {
        if (err)
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        res.jsonp(connection);
    });
};

exports.keepAlive = function(req, res) {
    console.log(req.pconnection);
    if (req.body && req.body.name)
        req.pconnection.name = req.body.name;
    req.pconnection.expiry = Date.now() + 5*60*1000;
    req.pconnection.save(function(err, pconnection) {
        if (err)
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        res.jsonp(req.pconnection);
    });
};

exports.delete = function(req, res) {
    req.pconnection.remove(function(err, pconnection) {
        if (err)
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        res.jsonp(pconnection);
    });
}

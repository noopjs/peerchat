'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    User = mongoose.model('User'),
    Connection = mongoose.model('Connection');

function randomName() {
    var adj = ['yummy','delicious','tasty','sweet','bitter',
    'sour','salty','slippery','slimy','spiky',
    'prickly smooth  rough','sticky','soft',
    'hard','wet dry furry','sad',
    'happy','funny','boring','nasty','naughty',
    'angry','mean','nice','beautiful','pretty',
    'lovely','friendly','grumpy','scary','lonely',
    'loud','noisy','quiet','slow','fast',
    'poor','rich','strong','weak','old',
    'new young','lazy','sleepy','tired',
    'furry','tall','short','round','fat',
    'long','skinny','thin','thick','smelly',
    'big little','tiny','small','huge',
    'enormous','gigantic','large','yellow','red',
    'orange','blue','purple  brown','black',
    'white','green','pink'];

    var nouns = ['apples','babies','balls','beds','bears',
    'boys','bells','birds','brothers','boats',
    'giants  dinosaurs','cakes','cars','cats',
    'children','corn','chairs  chickens','cows',
    'dogs','wind','dolls','frogs','ducks',
    'eggs','eyes','snails','waves','lizards',
    'feet','clouds','fish','trains','flowers',
    'pets','books','girls','snakes','grass',
    'pies','hands','pizzas','oranges bikes',
    'horses','houses','kittens legs','letters',
    'ants','men tomatoes','money','teeth',
    'mice','friends','spiders','pigs','rabbits',
    'rain','rings','clocks','fairies','planes',
    'songs','sheep','shoes','sisters','trees',
    'plants','trucks','sticks','sun','toys',
    'things'];
    return adj[Math.floor(Math.random()*adj.length)] + '-' + nouns[Math.floor(Math.random()*nouns.length)];
}

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
    if (!connection.name || connection.name.length === 0)
        connection.name = randomName();
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

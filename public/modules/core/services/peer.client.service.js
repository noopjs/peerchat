'use strict';

//Menu service used for managing  menus
angular.module('core').service('Peer', [
    '$timeout', '$http', '$q',
    function($timeout, $http, $q) {
        var that = this;
        that.name = 'Default';
        that.retry = 1000;
        that.keepAlive = 3*60*1000;
        that.notifications = $q.defer();

        that.peers = [];

        function status(what, params) {
            that.status = what;
            console.log('Peer Status: ' + what, params);
            that.notifications.notify(what);
        }

        function kick() {
            if (that.status !== 'connected')
                return;
            $http.put('/connections/' + that.connection._id)
                .then(function() {
                    $timeout(kick, that.keepAlive);
                }, function(err) {
                    console.error('kick', err); // FIXME: handle this
                });
        }

        function trackPeers() {
        	if (that.status !== 'connected')
        		return;
        	$http.get('/connections')
        		.then(function (resp) {
        			var connections = resp.data;
        			that.peers
        				.filter(function (p) {
        					return p._id !== that.connection._id;
        				})
        				.map(function (p) {
        					return _.findIndex(connections, {_id: p._id});
        				})
        				.reverse()
        				.forEach(function (i) {
        					if (i >= 0)
        						connections.splice(i, 1);
        				});
        			connections.forEach(function (p) {
        				p.notifications = $q.defer();
        				p.notify = function () { return p.notifications.promise };
        				p.conn = that.peer.connect(p.pid);
        				p.conn.on('open', function () {
        					console.log('connection opened with ', p);
        					that.peers.push(p);
        				});
        				p.conn.on('data', function (d) {
        					p.notifications.notify(d);
        				});
        				p.send = function (m) {
        					p.conn.send(m);
        				};
        				p.conn.on('close', function () {
        					that.peers.splice(_.findIndex(that.peers, {_id: p._id}), 1);
        				});
        				p.conn.on('error', function (err) {
        					console.log('peer error', err);
        					// FIXME handle this
        				});
        			});
        			$timeout(trackPeers, that.retry);
        		});
        }
        function connect() {
            status('connecting');
            //that.peer = new Peer('123456', {host: location.host.split(':')[0], port: location.host.split(':')[1]});
            that.peer = new Peer({
                key: '8yxqk2u1vz0yhkt9'
            });
            that.peer.on('open', function(id) {
                status('connected', id);
                that.id = id;
                that.retry = 1000;
                $http.post('/connections', {
                        pid: id,
                        name: that.name
                    })
                    .then(function(resp) {
                        that.connection = resp.data;
                        $timeout(kick, that.keepAlive);
                        $timeout(trackPeers, that.retry);
                    }, function(err) {
                        console.error('connect/post', err); // FIXME: handle this
                    });
            });
            that.peer.on('disconnected', function() {
                status('disconnected', that.retry);
                $timeout(function() {
                    that.retry += 1000;
                    status('connecting');
                    if (that.peer.destroyed)
                        connect();
                    else
                        that.peer.reconnect();
                }, that.retry);
            });
            that.peer.on('error', function(err) {
                status('error', err);
                // FIXME: handle this
            });
        }
        connect();
        // Public API
        that.setName = function(name) {
            that.name = name;
            $http.put('/connections/'+that.connection._id, {
                    name: that.name
                })
                .then(function(resp) {
                	console.log('response', resp.data);
                    //that.connection = resp.data;
                }, function(err) {
                    console.error('connect/setname', err); // FIXME: handle this
                });
        };
        that.notify = function () {
        	return that.notifications.promise;
        };

        that.send = function(pid, msg) {

        };

    }
]);

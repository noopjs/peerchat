'use strict';

//Menu service used for managing  menus
angular.module('core').service('Peer', [
    '$timeout', '$http', '$q', 
    function ($timeout, $http, $q) {
        var that = this;
        that.name = '';
        that.retry = 1000;
        that.keepAlive = 3 * 60 * 1000;
        that.autoRefresh = 60 * 1000;
        that.notifications = $q.defer();

        that.peers = [];

        function status(what, params) {
            that.status = what;
            console.log('Peer Status: ' + what);
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

        function initPeer(p) {
            p.notifications = $q.defer();         
            p.notify = function() {
                if(that.peers.length){
                    that.refresh();
                }
                return p.notifications.promise;
            };
            p.conn.on('data', function(d) {
                $http.get('/connections')
                    .then(function(resp) {
                        var connections = resp.data;        //===>Front End ??
                        console.log('Data: ' + d + '  Connections.Length..... ' + connections.length);
                });
                p.notifications.notify(d);
            });
            p.send = function(mss) {
                //console.log(mss);             
                p.conn.send(mss);
                  
            };
            p.conn.on('close', function() {
                that.peers.splice(_.findIndex(that.peers, {
                    _id: p._id
                }), 1);
            });
            p.conn.on('error', function(err) {
                console.log('peer error', err);
                // FIXME handle this
            });
        }

        function trackPeers() {
         
            if (that.status !== 'connected')
                return;
            $http.get('/connections')
                .then(function(resp) {
                var connections = resp.data;
                that.peers.filter(function(p) {
                       return p._id !== that.connection._id;})      //removes itself
                            .map(function(p) {
                                var x = _.findIndex(connections, {_id: p._id});
                                return x;
                            })
                            .reverse()                //reverse the array
                        .forEach(function(i) {
                            if (i >= 0){
                                connections.splice(i,1);
                            }
                        });
                connections.forEach(function(p) {
                        //console.log('Tracking..... ',p.name)
                        p.conn = that.peer.connect(p.pid);
                        initPeer(p);
                        //console.log('connecnted',p);
                        p.conn.on('open', function() {
                            console.log('connection opened with :', p.pid + '   name: ' +p.name);
                            that.peers.push(p);
                            p.conn.send(that.connection);                        
                        });
                        /*p.conn.on('error',function(err)
                                  { 
                            console.log('OLd peer unable to connect',p.name);
                            $http.delete('/connections//'+p.id);
                                  });*/
                    });
                    $timeout(trackPeers, that.autoRefresh);
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
                        that.name = that.connection.name;
                        status(that.status, that.name);
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
            that.peer.on('connection', function(conn) {
                console.log('CONNECTED');
                conn.on('data', function(m) {
                    var ndx = _.findIndex(that.peers, {
                        _id: m._id
                    });
                    if (ndx >= 0) {
                        conn.close();
                        return;
                    }
                    m.conn = conn;
                //console.log('connecnted',m);
                initPeer(m);     
                that.peers.push(m);
                });
            });
            that.peer.on('close',function(){
                $http.delete('/connections/' +that.peer.id);
            });
            that.peer.on('error', function(err) {
                //status('error', err);
                /*that.peers.splice(_.findIndex(that.peers, {
                    _id: p._id
                }), 1);*/
                console.log('Error', err);    // FIXME: handle this
            });
            
        }
        connect();
        // Public API
        that.setName = function(name) {
            that.name = name;
            $http.put('/connections//' + that.connection._id, {
                    name: that.name
                })
                .then(function(resp) {
                    console.log('response', resp.data);
                    //that.connection = resp.data;
                }, function(err) {
                    console.error('connect/setname', err); // FIXME: handle this
                });
        };
        that.notify = function() {
            return that.notifications.promise;
        };
        that.refresh = trackPeers;

    }
]);

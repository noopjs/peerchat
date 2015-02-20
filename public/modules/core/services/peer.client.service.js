'use strict';

//Menu service used for managing  menus
angular.module('core').service('Peer', [
<<<<<<< HEAD
    '$timeout', '$http', '$q', 
    function ($timeout, $http, $q) {
=======
    '$timeout', '$http', '$q',
    function($timeout, $http, $q) {
>>>>>>> c319451bee081bf9ac8611e2aaed57361b607636
        var that = this;
        that.name = '';
        that.retry = 1000;
        that.keepAlive = 3 * 60 * 1000;
        that.autoRefresh = 60 * 1000;
        that.notifications = $q.defer();

        that.peers = [];

        function status(what, params) {
            that.status = what;
<<<<<<< HEAD
            console.log('Peer Status: ' + what);
=======
            console.log('Peer Status: ' + what,params);
>>>>>>> c319451bee081bf9ac8611e2aaed57361b607636
            that.notifications.notify(what);
        }

        function kick() {
            if (that.status !== 'connected')
                return;
            $http.put('/connections/' + that.connection._id)
                .then(function() {
<<<<<<< HEAD
           
=======
>>>>>>> c319451bee081bf9ac8611e2aaed57361b607636
                    $timeout(kick, that.keepAlive);
                }, function(err) {
                    console.error('kick', err); // FIXME: handle this
                });
        }

        function initPeer(p) {
<<<<<<< HEAD
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
                  
=======
            p.notifications = $q.defer();
            p.notify = function() {
                return p.notifications.promise
            };
            p.conn.on('data', function(d) {
                p.notifications.notify(d);
            });
            p.send = function(m) {
                p.conn.send(m);
>>>>>>> c319451bee081bf9ac8611e2aaed57361b607636
            };
            p.conn.on('close', function() {
                that.peers.splice(_.findIndex(that.peers, {
                    _id: p._id
                }), 1);
            });
            p.conn.on('error', function(err) {
                console.log('peer error', err);
<<<<<<< HEAD
=======
                $http.delete('/connections/'+that.connection._id,{id:p.pid});
>>>>>>> c319451bee081bf9ac8611e2aaed57361b607636
                // FIXME handle this
            });
        }

        function trackPeers() {
<<<<<<< HEAD
         
=======
>>>>>>> c319451bee081bf9ac8611e2aaed57361b607636
            if (that.status !== 'connected')
                return;
            $http.get('/connections')
                .then(function(resp) {
<<<<<<< HEAD
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
=======
                    var connections = resp.data;
                    that.peers
                        .filter(function(p) {
                            return p._id !== that.connection._id; // Eliminate my own entry
                        })
                        .map(function(p) {
                            return _.findIndex(that.peers, {  // Eliminate peers that I'm already connected to
                                _id: p._id
                            });
                        })
                        .reverse()
                        .forEach(function(i) {
                            if (i >= 0)
                                connections.splice(i, 1);
                        });
                    connections.forEach(function(p) {
                        p.conn = that.peer.connect(p.pid);
                        initPeer(p);
                        p.conn.on('open', function() {
                            console.log('connection opened with ', p);
                            that.peers.push(p);
                            console.log(that.connection.name);
                            p.conn.send(that.connection);
                        });
>>>>>>> c319451bee081bf9ac8611e2aaed57361b607636
                    });
                    $timeout(trackPeers, that.autoRefresh);
                });
        }

        function connect() {
            status('connecting');
            //that.peer = new Peer('123456', {host: location.host.split(':')[0], port: location.host.split(':')[1]});
            that.peer = new Peer({
<<<<<<< HEAD
                key: '8yxqk2u1vz0yhkt9'
=======
                key: '8yxqk2u1vz0yhkt9' // per application
>>>>>>> c319451bee081bf9ac8611e2aaed57361b607636
            });
            that.peer.on('open', function(id) {
                status('connected', id);
                that.id = id;
                that.retry = 1000;
<<<<<<< HEAD
              $http.post('/connections', {
=======
                $http.post('/connections', {
>>>>>>> c319451bee081bf9ac8611e2aaed57361b607636
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
<<<<<<< HEAD
            that.peer.on('connection', function(conn) {
                console.log('CONNECTED');
=======
            that.peer.on('error', function(err) {
                //status('error', err);
                $http.delete('/connections/'+that.connection._id,{pid:that.id}).then(function(res){console.log(res);});
                //console.log('Error', err);
                // FIXME: handle this
            });
            that.peer.on('connection', function(conn) {
>>>>>>> c319451bee081bf9ac8611e2aaed57361b607636
                conn.on('data', function(m) {
                    var ndx = _.findIndex(that.peers, {
                        _id: m._id
                    });
                    if (ndx >= 0) {
                        conn.close();
                        return;
                    }
                    m.conn = conn;
<<<<<<< HEAD
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
            
=======
                    initPeer(m);
                    that.peers.push(m);
                });
            });
>>>>>>> c319451bee081bf9ac8611e2aaed57361b607636
        }
        connect();
        // Public API
        that.setName = function(name) {
            that.name = name;
<<<<<<< HEAD
            $http.put('/connections//' + that.connection._id, {
=======
            $http.put('/connections/' + that.connection._id, {
>>>>>>> c319451bee081bf9ac8611e2aaed57361b607636
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

'use strict';

//Menu service used for managing  menus
angular.module('core').service('Peer', [
	'$timeout',
	function($timeout) {
		var that = this;
		that.retry = 1000;
		function connect() {
			that.status = 'connecting';
			console.log('Connecting...');
			//that.peer = new Peer('123456', {host: location.host.split(':')[0], port: location.host.split(':')[1]});
			that.peer = new Peer({key: '8yxqk2u1vz0yhkt9'});
			that.peer.on('open', function (id) {
				that.status = 'connected';
				console.log('Connected:'+id);
				that.id = id;
				that.retry = 1000;
			});
			that.peer.on('disconnected', function () {
				that.status = 'disconnected';
				console.log('Disconnected. Retry in '+that.retry+' ms');
				$timeout(function () {
					that.retry += 1000;
					that.status = 'connecting';
					console.log('Reconnecting...');
					if (that.destroyed)
						connect();
					else
						that.peer.reconnect();
				}, that.retry);
			});
			that.peer.on('error', function (err) {
				that.status = 'error';
				console.log('Error', err);
			});
		}
		connect();
	}
]);
'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Peer',
	function($scope, Authentication, Peer) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.status = Peer.status;
		Peer.notify().then(function (){}, function (){}, 
			function (status) {
				$scope.status = status;
				$scope.name = Peer.name;
			}
		);
		$scope.name = Peer.name;
		$scope.changeName = function () { // FIXME need to throttle
			Peer.setName($scope.name);
		};
		$scope.text = "";
		$scope.peers = Peer.peers;
		$scope.curPeerNdx = -1;
		$scope.selectPeer = function (peer) {
			if ($scope.text.length)
				$scope.nextCmd();
			if ($scope.curPeerNdx >= 0 && $scope.peers[$scope.curPeerNdx].selected)
				$scope.peers[$scope.curPeerNdx].selected = false;

			$scope.curPeerNdx = _.findIndex($scope.peers, {_id: peer._id});
			var peer = $scope.peers[$scope.curPeerNdx];
			peer.selected = true;
			if (!peer.messages)
				peer.messages = [];
			peer.notify().then(function (){}, function (){}, 
				function (msg) {
					msg.send = false;
					var ndx = _.findIndex(peer.messages, { ts: msg.ts, send: false});
					if (ndx < 0)
						peer.messages.push(msg);
					else
						peer.messages[ndx].text = msg.text;
				})
		};
		if ($scope.peers.length)
			$scope.selectPeer($scope.peers[0]);
		var msg;
		$scope.textChange = function () {
			if ($scope.curPeerNdx < 0 || !$scope.peers[$scope.curPeerNdx].selected)
				return;
			var peer = $scope.peers[$scope.curPeerNdx];
			if (!msg) {
				msg = { send: true, ts: Date.now() };
				peer.messages.push(msg);
			}
			msg.text = $scope.text;
			peer.send(msg);
		};
		$scope.nextCmd = function () {
			$scope.textChange();
			$scope.text = "";
			msg = null;
		};
		$scope.refresh = Peer.refresh;
	}
]);


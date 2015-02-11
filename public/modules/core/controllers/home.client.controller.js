'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Peer',
	function($scope, Authentication, Peer) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.status = Peer.status;
		Peer.notify().then(function (){}, function (){}, 
			function (status) {
				$scope.status = status;
			}
		);
		$scope.name = Peer.name;
		$scope.changeName = function () { // FIXME need to throttle
			Peer.setName($scope.name);
		};
		$scope.text = "Text";
		$scope.peers = Peer.peers;
		if ($scope.peers.length) {
			$scope.curPeer = $scope.peers[0];
			$scope.curPeer.selected = true;
		}
		$scope.selectPeer = function (peer) {
			$scope.curPeer.selected = false;
			$scope.curPeer = peer;
			$scope.curPeer.selected = true;
		};

	}
]);
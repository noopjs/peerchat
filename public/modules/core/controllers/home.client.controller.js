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
		if ($scope.peers.length) {
			$scope.curPeerNdx = 0;
			$scope.peers[$scope.curPeerNdx].selected = true;
		}
		$scope.selectPeer = function (peer) {
			if ($scope.curPeerNdx >= 0 && $scope.peers[$scope.curPeerNdx].selected)
				$scope.peers[$scope.curPeerNdx].selected = false;

			$scope.curPeerNdx = _.findIndex($scope.peers, {_id: peer._id});
			$scope.peers[$scope.curPeerNdx].selected = true;
		};

	}
]);
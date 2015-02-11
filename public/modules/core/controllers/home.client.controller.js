'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.status = "Connecting...";
		$scope.name = "Name";
		$scope.text = "Text";
		$scope.peers = [
			{name: 'a', selected: true}, 
			{name: 'a', selected: false}, 
			{name: 'a', selected: false}, 
		];
		$scope.curPeer = $scope.peers[0];
		$scope.selectPeer = function (peer) {
			$scope.curPeer.selected = false;
			$scope.curPeer = peer;
			$scope.curPeer.selected = true;
		};

	}
]);
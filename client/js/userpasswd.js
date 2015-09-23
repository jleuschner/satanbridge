(function () {

	var app = angular.module('userpasswd', []);

	app.controller('userpasswdCtrl', ['$scope', 'ADUser', function ($scope, AdUser) {
		$scope.userNotFound = false;

		$scope.login = function () {
			$scope.userNotFound = false;
			AdUser.findById({ Id: $scope.username })
			.$promise
			.then(function (user) {
				//console.log(user);
				if (!user.dn) {
					$scope.userNotFound = true;
				} else {
					console.log($scope.username);
					AdUser.authenticate({ Id: $scope.username, password: $scope.password })
					.$promise
					.then(function (auth) {
						console.log(auth);
					})
				}
			},
			function (err) {
				console.log(err);
			})
		}

	$scope.authenticate = function(){
					AdUser.authenticate({ Id: $scope.username},{ password: $scope.password })
					.$promise
					.then(function (auth) {
						console.log(auth);
					})
	}


	} ]);

})();

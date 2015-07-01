(function () {

	var app = angular
		.module('adlogins', []);

	app.controller('loginCtrl', ['$scope', 'Login', function ($scope, Login) {
		$scope.logins = [];

		$scope.search = function () {
			Login.byHost({ 'host': $scope.hostname },
				function (list) {
					$scope.logins = list;
				});
		}

	} ]);


})();

(function () {

	var app = angular.module('userpasswd', []);

	app.controller('userpasswdCtrl', ['$scope', 'ADUser', function ($scope, AdUser) {

		$scope.init = function () {
			$scope.udata = {};
			$scope.user = {};
		}

		$scope.authenticate = function (username, password) {
			$scope.udata.passwdErr = false;
			$scope.udata.passwdMsg = "";
			$scope.udata.notFound = false;
			AdUser.authenticate({ Id: username }, { password: password })
				.$promise
				.then(function (auth) {
					if (!auth.user) {
						$scope.user = {};
						$scope.udata.notFound = true;
					} else {
						$scope.user = auth.user;
						if (auth.isAuthenticated) $scope.user.isAuthenticated = true;
					}
				})
		}

		$scope.passwd = function (username, oldPassword, newPassword) {
			$scope.udata.passwdErr = false;
			$scope.udata.passwdMsg = "";
			$scope.udata.passwdPending = true;
			AdUser.passwd({ Id: username }, { OldPassword: oldPassword, NewPassword: newPassword })
			.$promise
			.then(function (result) {
				$scope.udata.passwdPending = false;
				if (!result.passwd) {
					$scope.udata.passwdErr = true;
					$scope.udata.passwdMsg = "Fehler bei der Kennwortänderung!";
				} else {
					$scope.udata.passwdErr = false;
					$scope.udata.passwdMsg = "Kennwort erfolgreich geändert!";
					$scope.udata.password = newPassword;
				}
			})
		}

		$scope.init();
	} ]);

})();

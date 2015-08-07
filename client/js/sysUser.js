(function () {
	var app = angular.module('sysUser', []);

	app.controller('sysUserCtrl', ['$scope', 'User', 'UserGroup', '$location', function ($scope, User, UserGroup, $location) {

		$scope.UserGroups = [];
		$scope.getUserGroups = function () {
			User.find({},
				function (list) {
					$scope.UserGroups = list;
				});
		}
		$scope.getUserGroups();


	} ]);

})();

(function () {

	var app = angular.module('aduser', []);

	app.directive('user', function () {
		return {
			restrict: 'E',
			replace: false,
			templateUrl: 'views/snips/user.html'
		};
	});

	app.controller('aduserCtrl', ['$scope', 'ADUser', function ($scope, AdUser) {

		$scope.userList = [];
		$scope.departmentList = [];

		$scope.departmentUserList = [];

		$scope.getList = function (filter) {
			$scope.userList = [];
			AdUser.find({
				filter: filter
			})
			.$promise
			.then(
				function (list) {
					list.forEach(function (obj) {
						//if (obj.department != obj.extensionAttribute1 && obj.Enabled && obj.ObjectClass=='user') {
						if (obj.Enabled && obj.ObjectClass == 'user') {
							$scope.userList.push(obj);
						}
					})
					//$scope.userList = list;
				},
				function (err) {
					console.log(err);
				});
		};

		$scope.getDepartments = function (filter) {
			$scope.departmentList = [];
			AdUser.departments({
				filter: filter
			})
			.$promise
			.then(
				function (list) {
					/*
					list.forEach(function (obj) {
					if (obj.department != obj.extensionAttribute1 && obj.Enabled && obj.ObjectClass=='user') {
					$scope.userList.push(obj);
					}
					})
					*/
					$scope.departmentList = list;
				},
				function (err) {
					console.log(err);
				});
		};

		$scope.selectDepartment = function (dep) {
			AdUser.find({ filter: "department=" + dep })
			.$promise
			.then(
				function (users) {
					console.log(users);
					$scope.departmentUserList = users; ;
				},
				function (err) {
					console.log(err);
				}
			)
		}



		// Typeahead - Function
		$scope.getUsers = function (val) {
			return AdUser.find({
				//filter: '{ Name -like "*' + val + '*"}'
				filter: 'name=*' + val + '*'
			})
			.$promise
			.then(
				function (list) {
					//$scope.users = list;
					//console.log(list);
					return list;
				},
			function (err) {
				console.log("ERRRR: ", err);
			})
		};

	} ]);

})();

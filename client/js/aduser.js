(function () {

	var app = angular.module('aduser', []);

	app.controller('aduserCtrl', ['$scope', 'ADUser', function ($scope, AdUser) {

		$scope.users = [];
		var i = 0;


		$scope.getUsers = function (val) {
			return AdUser.find({
				filter: '{ Name -like "*' + val + '*"}'
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
		//$scope.users = $scope.getUsers("");

		/*
		$scope.refresh = function () {
		console.log("REFRESH ", i++);
		AdUser.findbyfilter({ filter: '{Surname -like "Leuschner"} ' },
		function (list) {
		console.log(list);
		for (i = 0; i < list.length; i++) {
		console.log(list[i]);
		}
		$scope.users = list;
		});
		};
		$scope.refresh();
		*/
	} ]);

})();

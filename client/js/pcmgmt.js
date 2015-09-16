(function () {

	var app = angular.module('pcmgmt', []);

	app.controller('pcmgmtCtrl', ['$scope', 'Asset', 'Jlpq', function ($scope, Asset, printqueues) {

		$scope.pc = {};

		$scope.getPC = function (val) {
			return Asset.find({ filter: {
				where: { geraet: { like: 'pc_%' }, hostname: { like: '%' + val + '%'} },
				order: 'hostname desc',
				limit: 10
			}
			})
			.$promise
			.then(
				function (list) {
					return list;
				})
		};

		$scope.selectPC = function ($item, $model, $label) {
			$scope.pc=$item;
		}


		$scope.printqueues = [];

		$scope.refresh = function () {
			printqueues.getQueues({},
			function (list) {
				for (i = 0; i < list.length; i++) {
					list[i].Name += "!!";
					console.log(list[i]);
				}
				$scope.printqueues = list;
			});
		};
		//$scope.refresh();

	} ]);

})();

(function () {

	var app = angular.module('printqueues', []);

	app.controller('printqueueCtrl', ['$scope', 'Jlpq', function ($scope, printqueues) {
		$scope.printqueues = [];

		$scope.refresh = function () {
			printqueues.getQueues({},
			function (list) {
				for (i = 0; i < list.length; i++) {
					console.log(list[i]);
				}
				$scope.printqueues = list;
			});
		};
		$scope.refresh();

	} ]);

})();

(function () {
	var app = angular.module('tiles', []);

	app.directive("tile", function () {
		return {
			restrict : "E",
			template: "Ein Tile!"
		};
	})

	app.controller('tilesCtrl', ['$scope', '$location', function ($scope, $location) {
		$scope.showtile = true;

		$scope.click = function () {
			$scope.showtile = false;
		}

	} ]);

})();
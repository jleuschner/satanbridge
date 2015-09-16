(function () {

	var app = angular.module('adcomputer', []);

	app.controller('adcomputerCtrl', ['$scope', '$routeParams', 'ADComputer', function ($scope, $routeParams, AdComputer) {

		$scope.computers = [];
		$scope.computer = {};
		$scope.pingPending = false;
		$scope.online = false;

		$scope.dns = [];
		$scope.dns_rev = [];
		$scope.DnsPending = false;

		$scope.missingupdates = [];


		// Aufruf per /:computer
		if ($routeParams.computer) {
			$scope.computerSelected = $routeParams.computer;
			AdComputer.findById({ id: $routeParams.computer, properties: "IPv4Address" })
				.$promise
				.then(function (result) {
					if (result.Name) {
						$scope.computerSelected = result.Name;
						$scope.selectComputer(result);
					} else {
						$scope.noResults = true;
					}
				});
		}
		// ----------------

		$scope.selectComputer = function ($item, $model, $label) {
			$scope.computer = $item;
			$scope.dns = [];
			$scope.nslookup($scope.computer.Name, function (result) { $scope.dns = result });
			$scope.dns_rev = [];
			$scope.nslookup($scope.computer.IPv4Address, function (result) { $scope.dns_rev = result });

			$scope.ping($scope.computer.Name);
		}

		$scope.getComputers = function (val) {
			return AdComputer.find({
				filter: '{ Name -like "*' + val + '*"}',
				properties: 'IPv4Address'
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

		$scope.getComputersByFilter = function (filter, properties) {
			AdComputer.find({
				filter: filter,
				properties: properties
			})
			.$promise
			.then(
				function (list) {
					$scope.computers = list;
					console.log(list)
				},
				function (err) {
					console.log(err);
				})


		}

		$scope.ping = function (computername) {
			$scope.online = false;
			$scope.pingPending = true;
			AdComputer.ping({ 'id': computername })
				.$promise
				.then(function (result) {
					$scope.pingPending = false;
					$scope.online = result.ping;
					if ($scope.online) {
						$scope.getUpdates(computername);
					}
				});
		}

		$scope.nslookup = function (name, cb) {
			$scope.DnsPending = true;
			AdComputer.nslookup({ 'id': name })
				.$promise
				.then(function (result) {
					$scope.DnsPending = false;
					cb(result);
				});
		}

		$scope.getUpdates = function (name, cb) {
			$scope.missingUpdates = [];
			AdComputer.updates({ 'id': name })
				.$promise
				.then(function (result) {
					if (!result.error) {
						if (result.updates.length) {
							$scope.missingUpdates = result.updates;
						} else {
							$scope.missingUpdates = Array({ Name: "Keine ausstehenden Updates" });
						}
					} else {
						$scope.missingUpdates = Array({ Name: "Abfragefehler! Kein SCCM-Client?" });
					}
					//$scope.DnsPending = false;
					//cb(result);
				});
		}



	} ]);

})();

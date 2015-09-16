(function () {

	var app = angular.module('adcomputer', []);

	app.controller('adcomputerCtrl', ['$scope', '$routeParams', 'ADComputer', function ($scope, $routeParams, AdComputer) {

		$scope.computerList = [];
		/* $scope.computerList -> Ergebnissatz generiert durch getComputersByFilter :
		computerList = [{
		computer				: AdObject,
		online					: Ping-Ergebnis (-1 unknown, 0 offline, 1 online)
		onlinePending		: Ping aktiv?
		updates					: fehlende Updates
		updatesPending	: Updateabfrage aktiv ?
		},
		{..}]
		*/

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


		//-------------------
		$scope.getComputersByFilter = function (filter, properties) {
			$scope.computerList = [];
			AdComputer.find({
				filter: filter,
				properties: properties
			})
			.$promise
			.then(
				function (list) {
					//var i = 0;
					list.forEach(function (obj) {
						//console.log(i++, obj.Name);
						$scope.computerList.push({
							computer: obj,
							online: 0,
							onlinePending: false,
							updates: -1,
							updatesPending: false
						});
					})
					pingList(function (obj) {
						getUpdatesList(obj);
					});
					//getUpdatesList($scope.computerList[28]);
					//getUpdatesList($scope.computerList[50]);
					//getUpdatesList($scope.computerList[31]);
					//console.log(list)
				},
				function (err) {
					console.log(err);
				})
		};

		var pingList = function (cbEach) {
			$scope.computerList.forEach(function (obj) {
				obj.online = -1;
				obj.onlinePending = true;
				AdComputer.ping({ 'id': obj.computer.DNSHostName })
					.$promise
					.then(function (result) {
						obj.onlinePending = false;
						obj.online = result.ping;
						if (obj.online && cbEach) cbEach(obj);
					});
			});
		}

		var getUpdatesList = function (obj) {
			if (obj.computer.OperatingSystem.indexOf("200")>0 || obj.computer.OperatingSystem.indexOf("200")>0) {
				return;
			}
			obj.updatesPending = true;
			obj.updates = -1;
			AdComputer.updatescount({ 'id': obj.computer.Name })
				.$promise
				.then(function (result) {
					obj.updatesPending = false;
					if (!result.error) {
						obj.updates = result.updates;
					} else {
						obj.updates = -1;
					}
				});
		}

		//---------------

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

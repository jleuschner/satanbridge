(function () {

	var app = angular.module('adcomputer', []);

	app.controller('adcomputerCtrl', ['$scope', '$routeParams', 'ADComputer', function ($scope, $routeParams, AdComputer) {

		$scope.computerList = [];
		/* $scope.computerList -> Ergebnissatz generiert durch getComputersByFilter :
		computerList = [{
		computer				: {} AdObject,
		online					: Ping-Ergebnis (-1 unknown, 0 offline, 1 online)
		onlinePending		: Ping aktiv?
		dns							: [] Forward-nslookup
		dns_rev					: [] Reverse-nslookup
		dnsPending			: nslookup aktiv ?
		updateCount			: Anzahl fehlender Updates (-1 unknown)
		updates					: [] fehlende Updates
		updatesPending	: Updateabfrage aktiv ?
		},
		{..}]
		*/

		$scope.objSelected = {};


		// Aufruf per /:computer
		if ($routeParams.computer) {
			AdComputer.findById({ id: $routeParams.computer, properties: "OperatingSystem,IPv4Address" })
				.$promise
				.then(function (result) {
					if (result.Name) {
						$scope.selectComputer({ computer: result });
					} else {
						$scope.noResults = true;
					}
				});
		}

		//-------------------

		$scope.getComputers = function (val) {
			return AdComputer.find({
				filter: '{ Name -like "*' + val + '*"}',
				properties: 'IPv4Address'
			})
			.$promise
			.then(
				function (list) {
					var returnList = [];
					list.forEach(function (obj) {
						returnList.push({
							computer: obj,
							online: -1,
							onlinePending: false,
							updateCount: -1,
							updatesPending: false
						});
					});
					return returnList;
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
							online: -1,
							onlinePending: false,
							updateCount: -1,
							updatesPending: false
						});
					})


					pingList(function (obj) {
						getUpdateCount(obj);
					});

				},
				function (err) {
					console.log(err);
				})
		};

		// ----------------

		$scope.selectComputer = function ($item, $model, $label) {
			$scope.objSelected = $item;
			$scope.nslookup($item);
			$scope.ping($item, function (online) {
				if (online) {
					$scope.getUpdates($item);
				}
			})
		}

		// ----------------

		var pingList = function (cbEach) {
			$scope.computerList.forEach(function (obj) {
				$scope.ping(obj, function (online) {
					if (obj.online && cbEach) cbEach(obj);
				});
			});
		}

		$scope.ping = function (obj, cb) {
			obj.onlinePending = true;
			obj.online = -1
			AdComputer.ping({ 'id': obj.computer.Name })
				.$promise
				.then(function (result) {
					obj.onlinePending = false;
					obj.online = result.ping;
					if (cb) cb(result.ping);
				});
		}

		$scope.nslookup = function (obj, cb) {
			obj.dnsPending = true;
			AdComputer.nslookup({ 'id': obj.computer.Name })
				.$promise
				.then(function (result) {
					obj.dns = result;
					if (obj.computer.IPv4Address) { //reverse Lookup
						AdComputer.nslookup({ 'id': obj.computer.IPv4Address })
							.$promise
							.then(function (result) {
								obj.dns_rev = result;
								obj.dnsPending = false;
								if (cb) cb(result);
							});
					} else {  // nur forward
						obj.dnsPending = false;
						if (cb) cb(result);
					}
				});
		}

		var getUpdateCount = function (obj) {
			if (obj.computer.OperatingSystem.indexOf("200") > 0 || obj.computer.OperatingSystem.indexOf("200") > 0) {
				return;
			}
			obj.updatesPending = true;
			obj.updateCount = -1;
			AdComputer.updatescount({ 'id': obj.computer.Name })
				.$promise
				.then(function (result) {
					obj.updatesPending = false;
					if (!result.error) {
						obj.updateCount = result.updates;
					} else {
						obj.updateCount = -1;
					}
				});
		}

		$scope.getUpdates = function (obj, cb) {
			obj.updatesPending = true;
			obj.updateCount = -1;
			obj.updates = [];
			AdComputer.updates({ 'id': obj.computer.Name })
				.$promise
				.then(function (result) {
					obj.updatesPending = false;
					if (!result.error) {
						obj.updateCount = result.updates.length;
						if (result.updates.length) {
							obj.updates = result.updates;
						} else {
							obj.updates = Array({ Name: "Keine ausstehenden Updates" });
						}
					} else {
						obj.updates = Array({ Name: "Abfragefehler! Kein SCCM-Client?" });
					}
					if (cb) cb(result);
				});
		}



	} ]);

})();

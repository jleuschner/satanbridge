(function () {

	var app = angular.module('win7mig', []);

	app.controller('DepartmentCtrl', ['$scope', 'Department', function ($scope, Department) {


		$scope.refresh = function () {
			$scope.countHosts = 0;
			$scope.countXP = 0;
			$scope.countW7 = 0;
			Department.getHosts({},
			function (list) {
				var gesamt = 0;
				var gesamtXP = 0;
				var gesamtW7 = 0;
				for (i = 0; i < list.length; i++) {
					list[i].winXP = 0;
					list[i].win7 = 0;
					for (j = 0; j < list[i].Assets.length; j++) {
						gesamt++;
						if (list[i].Assets[j].invOs.indexOf("Windows XP") > -1) { list[i].winXP++; gesamtXP++; list[i].Assets[j].invOs = "WindowsXP" }
						if (list[i].Assets[j].invOs.indexOf("Windows 7") > -1) { list[i].win7++; gesamtW7++; list[i].Assets[j].invOs = "Windows7" }
					}
					if (list[i].winXP===0) list[i].depStatus = "panel-success";
					if (list[i].win7===0) list[i].depStatus = "panel-danger";
					if (list[i].win7!=0 && list[i].winXP!=0) list[i].depStatus = "panel-warning";
				}
				$scope.departments = list;
				$scope.countHosts = gesamt;
				$scope.countXP = gesamtXP;
				$scope.countW7 = gesamtW7;
			});
		};
		$scope.refresh();

	} ]);

	app.controller('win7WorklistCtrl', ['$scope', 'Department', function ($scope, Department) {

		$scope.refresh = function () {
			$scope.countHosts = 0;
			$scope.countAustausch = 0;
			$scope.countPXE = 0;
			Department.getWorklist({},
			function (list) {
				var gesamt = 0;
				var gesamtAustausch = 0;
				var gesamtPXE = 0;
				for (i = 0; i < list.length; i++) {
					list[i].Austausch = 0;
					list[i].PXE = 0;
					for (j = 0; j < list[i].Assets.length; j++) {
						gesamt++;
						if (list[i].Assets[j].benutzer.indexOf("Austausch") > -1) { list[i].Austausch++; gesamtAustausch++; }
						if (list[i].Assets[j].benutzer.indexOf("PXE") > -1) { list[i].PXE++; gesamtPXE++; }
					}
				}
				$scope.departments = list;
				$scope.countHosts = gesamt;
				$scope.countAustausch = gesamtAustausch;
				$scope.countPXE = gesamtPXE;
			});
		};
		$scope.refresh();

	} ]);



})();

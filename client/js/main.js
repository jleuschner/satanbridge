var mainApp = angular.module('mainApp', [
			'ngRoute','lbServices', 'ui.bootstrap', 'ngAnimate', 'angular-loading-bar', 
			'win7mig', 'adlogins','sysUser', 'printqueues', 'pcmgmt', 'aduser', 'adcomputer', 'userpasswd', 'tiles'
			]);


mainApp.config(function ($routeProvider, $locationProvider, $httpProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/home.html'
			//controller: 'mainCtrl'
		})
		.when('/userpasswd', {
			templateUrl: 'views/userpasswd.html',
			controller: 'userpasswdCtrl'
		})
		.when('/tiles', {
			templateUrl: 'views/tiles.html',
			controller: 'tilesCtrl'
		})
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'loginCtrl'
		})
		.when('/logout', {
			templateUrl: 'logout.html',
			controller: 'logoutCtrl'
		})
		.when('/UserGroups', {
			templateUrl: 'views/sysUserGroups.html',
			controller: 'sysUserCtrl'
		})
		.when('/Win7mig', {
			templateUrl: 'views/win7mig.html',
			controller: 'mainCtrl'
		})
		.when('/Win7mig/worklist', {
			templateUrl: 'views/win7worklist.html',
			controller: 'win7WorklistCtrl'
		})
		.when('/printqueues', {
			templateUrl: 'views/printqueues.html',
			controller: 'printqueueCtrl'
		})
		.when('/pc', {
			templateUrl: 'views/pcmgmt.html',
			controller: 'pcmgmtCtrl'
		})
		.when('/aduser', {
			templateUrl: 'views/aduser.html',
			controller: 'aduserCtrl'
		})
		.when('/adcomputer/:computer?', {
			templateUrl: 'views/adcomputer.html',
			controller: 'adcomputerCtrl'
		})
		.when('/server/:computer?', {
			templateUrl: 'views/adserver.html',
			controller: 'adcomputerCtrl'
		})
		.when('/ADLogins', {
			templateUrl: 'views/adLogins.html',
			controller: 'loginCtrl'
		});



	$httpProvider.interceptors.push(function ($q, $location, LoopBackAuth) {
		return {
			responseError: function (rejection) {
				if (rejection.status == 401) {
					//Now clearing the loopback values from client browser for safe logout...
					LoopBackAuth.clearUser();
					LoopBackAuth.clearStorage();
					if (!$location.nextAfterLogin) { $location.nextAfterLogin = $location.path(); }
					//$location.nextAfterLogin = "/Win7mig";
					$location.path('/login');
				}
				return $q.reject(rejection);
			}
		};
	});

	//$locationProvider.html5Mode(true);

})


mainApp.controller('loginCtrl', ['$scope', 'User', '$location', function ($scope, User, $location) {

	$scope.login = function () {
		User.login({ rememberMe: false }, { "username": $scope.username, "password": $scope.password },
			function (accessToken) {
				$scope.$parent.getUser();
				var next = $location.nextAfterLogin || '/';
				if (next === "/login") { next = "/"; }
				$location.nextAfterLogin = null;
				$location.path(next);
			},
			function (err) {
				console.log("Next:" + $location.nextAfterLogin);
				$scope.message = err.data.error.message;
			}
		);
	}
} ]);

mainApp.controller('logoutCtrl', ['$scope', function ($scope) {
	$scope.$parent.logout();
} ]);


mainApp.controller('mainCtrl', ['$scope', '$location', 'User', function ($scope, $location, User) {

	$scope.getUser = function () {
		if (User.isAuthenticated()) {
			User.getCurrent(function (user) {
				console.log(user.toJSON());
				$scope.user = user.toJSON();
			});
		}
	}
	$scope.getUser();


	$scope.logout = function () {
		if (User.isAuthenticated()) {
			User.logout({}, function () {
				$scope.user = {};
			});
		}
	};

} ]);


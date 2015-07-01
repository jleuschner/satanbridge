var mainApp = angular.module('mainApp', [
			'ngRoute','lbServices', 'ui.bootstrap', 'ngAnimate', 'angular-loading-bar', 
			'win7mig', 'adlogins'
			]);

mainApp.config(function ($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'mainCtrl'
		})
		.when('/Win7mig', {
			templateUrl: 'views/win7mig.html',
			controller: 'mainCtrl'
		})
		.when('/Win7mig/worklist', {
			templateUrl: 'views/win7worklist.html',
			controller: 'win7WorklistCtrl'
		})
		.when('/ADLogins', {
			templateUrl: 'views/adLogins.html',
			controller: 'loginCtrl'
		});

	//$locationProvider.html5Mode(true);

})

mainApp.controller('mainCtrl', function ($scope) {
	$scope.msg = 'My Message...';
});


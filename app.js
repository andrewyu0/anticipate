var app = angular.module('anticipate', []);

app.controller('MainCtrl', [
	'$scope', function($scope){
		$scope.test = 'Hello World!';
	}
]);
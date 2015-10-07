var app = angular.module('anticipate', []);

app.controller('MainCtrl', [
	'$scope', function($scope){

		$scope.test = 'Hello World!';

		$scope.posts = [
		  {title: 'post 1', upvotes: 5},
		  {title: 'post 2', upvotes: 2},
		  {title: 'post 3', upvotes: 20},
		];

	}
]);
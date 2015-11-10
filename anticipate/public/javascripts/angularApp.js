/****************
 * APP *
 ****************/
var app = angular.module('anticipate', [
	'ui.router'
]);

/****************
 * STATES *
 ****************/

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){
		$stateProvider
		
		.state('home', {
			url         : '/home',
			templateUrl : '/home.html',
			controller  : 'MainCtrl',
			resolve     :  ['postsService', function(postsService){
					return postsService.getAll();
				}]
		})
		
		// State where individual post can be accessed 
		.state('posts', {
			url: '/posts/{id}',
			templateUrl: '/posts.html',
			controller: 'PostsCtrl'
		});
		// If app receives an undefined URL, redirect to home 
		$urlRouterProvider.otherwise('home');

}]);

/****************
 *  FACTORY    *
 ****************/

app.factory('postsService', ['$http', function($http){

	var output = {
		posts : [
		  {title: 'post 1', upvotes: 5, link: '', comments: []},
		  {title: 'post 2', upvotes: 2, link: '', comments: []},
		  {title: 'post 3', upvotes: 20, link: '', comments: []},
		]
	};

	// GET ALL POSTS FUNCTION
	output.getAll = function(){
		return $http.get('/posts').success(function(data){
			// Use angular.copy to create deep copy of returned data
			// Format: angular.copy(source, destination)
			angular.copy(data, output.posts)
		});
	}


	return output;

}]);

/***************
 * CONTROLLER *
 ****************/

app.controller('MainCtrl', ['$scope', 'postsService', function($scope, postsService){

		$scope.posts = postsService.posts;

		console.log("$scope.posts")
		console.log($scope.posts)

		// ADD POST FUNCTIONALITY
		$scope.addPost = function(){
			
			// Prevent user from submitting empty title post
			if(!$scope.title || $scope.title === ''){ 
				console.log("Post requires a title!")
				return ;
			}
			// New Post Object
			var newPost = {
				title    : $scope.title, 
				link     : $scope.link, 
				upvotes  : 0,
				comments : [
					{author: "Joe", body: "Whats up!", upvotes: 1},
					{author: "Joe2", body: "Whats up man!", upvotes: 1}
				]
			};

			// Push new post into array
			$scope.posts.push(newPost);
			
			// reset
			$scope.title = '';
			$scope.link = '';
		};

		// Upvoting Functionality 
		$scope.incrementUpvotes = function(post){
			post.upvotes += 1;
		};
	}
]);

// Posts controller 

app.controller('PostsCtrl', [
'$scope',
'$stateParams',
'postsService',
function($scope, $stateParams, postsService){

	// Grabs appropriate post from 'posts' service using id from $stateParams
	$scope.post = postsService.posts[$stateParams.id];

	console.log($scope.post)

	// ADD COMMENT FUNCTIONALITY
	$scope.addComment = function(){
		
		var newComment = {
			body    : $scope.body,
			author  : 'user',
			upvotes : 0
		};

		$scope.post.comments.push(newComment);
		// reset
		$scope.body = '';
	}	
}]);
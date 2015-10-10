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
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl'
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

app.factory('postsService', [function(){

	var output = {
		posts: []
	};

	return output;

}]);


/***************
 * CONTROLLER *
 ****************/

app.controller('MainCtrl', [
	'$scope', 'postsService', function($scope, postsService){

		$scope.test = 'Hello World!';

		$scope.posts = [
		  {title: 'post 1', upvotes: 5, link: '', comments: []},
		  {title: 'post 2', upvotes: 2, link: '', comments: []},
		  {title: 'post 3', upvotes: 20, link: '', comments: []},
		];

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
		}

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

		// Upvoting Functionality 
		$scope.incrementUpvotes = function(post){
			post.upvotes += 1;
		};

		// Submit link functionality


	}
]);

// Posts controller 

app.controller('PostsCtrl', [
'$scope',
'$stateParams',
'postsService',
function($scope, $stateParams, postsService){
	// Grabs appropriate post from 'posts' service using id from $stateParams
	$scope.posts = postsService.posts[$stateParams.id];

}]);
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
			url         : '/posts/{id}',
			templateUrl : '/posts.html',
			controller  : 'PostsCtrl',
			resolve     : {
				currentPost : ['$stateParams','postsService', function($stateParams, postsService){
				// Pretty important; can invoke the service method with
				// param using $stateParams.id in the resolve
					return postsService.getOne($stateParams.id)
				}] 
			}
		});
		// If app receives an undefined URL, redirect to home 
		$urlRouterProvider.otherwise('home');

}]);

/****************
 *  FACTORY    *
 ****************/

app.factory('postsService', ['$http', function($http){

	// Define our output for the service
	var output = {
		// Posts are an array of posts
		posts : [
			// Dummy data
		  // {title: 'post 1', upvotes: 5, link: '', comments: []},
		  // {title: 'post 2', upvotes: 2, link: '', comments: []},
		  // {title: 'post 3', upvotes: 20, link: '', comments: []},
		]
	};

	// GET ALL POSTS FUNCTION
	output.getAll = function(){
		return $http.get('/posts').success(function(allPosts){
			// Use angular.copy to create deep copy of returned data
			// Format: angular.copy(source, destination)
			// Once this promise is resolved, it will set the value of output.posts
			angular.copy(allPosts, output.posts);
		});
	}

	// GET ONE POST
	output.getOne = function(postId){
		return $http.get('/posts/' + postId).then(function(res){
			return res.data;
		});
	};

	// CREATE NEW POSTS 
	output.createPost = function(newPostData){
		console.log("postsService.createPost invoked")
		// return of route
		return $http.post('/posts', newPostData).success(function(newPost){
			// Once post is created and sent, push to output.posts
			output.posts.push(newPost);
		});
	}

	// UPVOTE POST 
	output.upvote = function(post){
		console.log("postsService.upvote invoked")
		// return of the 'posts/:postId/upvote' route
		return $http.put('/posts/'+post._id+'/upvote').success(function(postUpvoted){
			// Post on server is updated, but not on frontend
			// Add upvote to post on frontend
			post.upvotes += 1;
		});
	}

	// ADD COMMENT
	output.addComment = function(postId, comment){
		// POST '/posts/:postId/comments'
		return $http.post('/posts/' + postId + '/comments', comment);
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

			// Hit createPost service method > server call 
			postsService.createPost({
				title : $scope.title,
				link  : $scope.link
			});
			

			// reset values
			$scope.title = '';
			$scope.link = '';
		};

		// Upvoting Functionality 
		$scope.incrementUpvotes = function(post){
			// post.upvotes += 1;
			postsService.upvote(post);
		};
	}
]);

// Posts controller 

app.controller('PostsCtrl', [
'$scope',
'postsService',
'currentPost',
function($scope, postsService, currentPost){

	console.log(currentPost)
	// Grabs appropriate post from 'posts' service using id from $stateParams
	// $scope.post = postsService.getOne($stateParams.id);
	// $scope.post = postsService.currentPost;

	// $scope.post = postsService.currentPost;
	$scope.post = currentPost

	// ADD COMMENT FUNCTIONALITY
	// $scope.addComment = function(){
		
	// 	var newComment = {
	// 		body    : $scope.body,
	// 		author  : 'user',
	// 		upvotes : 0
	// 	};

	// 	$scope.post.comments.push(newComment);
	// 	// reset
	// 	$scope.body = '';
	// }	


	$scope.addComment = function(){
		if($scope.body === ''){return;}

		var newComment = {
			body    : $scope.body,
			author  : 'user',
			upvotes : 0
		};

		postsService.addComment($scope.post._id, newComment).success(function(newCommentSaved){
			$scope.post.comments.push(newCommentSaved);
		});

		// reset
		$scope.body = '';
	}


}]);
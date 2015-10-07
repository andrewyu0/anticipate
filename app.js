var app = angular.module('anticipate', []);

app.controller('MainCtrl', [
	'$scope', function($scope){

		$scope.test = 'Hello World!';

		$scope.posts = [
		  {title: 'post 1', upvotes: 5},
		  {title: 'post 2', upvotes: 2},
		  {title: 'post 3', upvotes: 20},
		];

		// Posting Functionality 
		$scope.addPost = function(){
			// Prevent user from submitting empty title post
			if(!$scope.title || $scope.title === ''){ return ;}

			var newPost = {
				title : $scope.title, 
				link : $scope.link, 
				upvotes : 0
			};
			
			$scope.posts.push(newPost);
			// reset
			$scope.title = '';
			$scope.link = '';
		}

		// Upvoting Functionality 
		$scope.incrementUpvotes = function(post){
			post.upvotes += 1;
		};

		// Submit link functionality


	}
]);
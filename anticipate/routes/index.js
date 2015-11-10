var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var Post     = mongoose.model('Post');
var Comment  = mongoose.model('Comment');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/************************
 *        POSTS         * 
 ************************/


router.get('/posts', function(req, res, next) {
  
	console.log("----- GET /posts route hit")
  Post.find(function(err, posts){
    if(err){ return next(err); }
    console.log("---------- sending posts")
    res.json(posts);
  });
});


router.post('/posts', function(req, res, next) {
  var post = new Post(req.body);

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});

// POSTID PARAM MIDDLEWARE

// Create a route for PRELOADING post objects 
// Any route with :postId in it, this function will be run first. All remaining routes are some form of "/posts/:id"
// router.param(post) > return query, exec on query for promise > next() 
// Params of router.param's cb are always: req, res, next, param value, param name

router.param('postId', function(req, res, next, id, name) {
	
	console.log("----- /post param hit: ")
 	console.log("This is the id in params:" + id)	// "5633b0bbd70442bc34a194af"
	console.log("name of param: " + name) // "postId"

	// findById returns a query, not doc
  var query = Post.findById(id);

  // query.exec(callback) returns a promise
  query.exec(function (err, post){
    
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }

    console.log("post.toObject() output:" + post.toObject() )

    // Add doc on the req object
    req.post = post;
		
		console.log("---------- invoke next() pass control to next matching route")

		// Passes control to the next matching route
    return next();
  });
});

// GET A SINGLE POST
// localhost:3000/posts/:id
router.get('/posts/:postId', function(req, res) {
  console.log("-----/posts/:postId invoked")
  console.log("This is the document received:" + req.post)
  // Populate 'comments' field so comments associated with particular post are loaded
  req.post.populate('comments', function(err, post){
		res.json(req.post);
  });
});

// ADD UPVOTE TO A POST
router.put('/posts/:postId/upvote', function(req, res, next){
	// invoke post's upvote() method 
	req.post.upvote(function(err, post){
		if(err){return next(err);}
		// Post should have an upvote added and saved
		res.json(post);
	});
});



/************************
 *       COMMENTS       * 
 ************************/

// COMMENTID PARAM MIDDLEWARE
router.param('commentId', function(req, res, next, id){
	console.log("----- commentId PARAM MIDDLEWARE hit")
	// Query for the comment
	var query = Comment.findById(id);
	// Get doc from query
	query.exec(function(err, comment){
		req.post.comment = comment;
		return next();
	});
});


// GET A SINGLE COMMENT 
router.get('/posts/:postId/comments/:commentId', function(req, res){
	console.log("----- GET /posts/:postId/comments/:commentId invoked")
	console.log(req.post.comment)
	res.json(req.post.comment)
});


// CREATE COMMENT, ADD TO POST
router.post('/posts/:postId/comments', function(req, res, next){
	// create new comment
	var comment = new Comment(req.body);
	// set post property on comment
	comment.post = req.post;
	// save the comment to db
	comment.save(function(err, comment){
		if(err){return next(err);}
		// add the comment to the post to create two-way relationship
		req.post.comments.push(comment);
		req.post.save(function(err,post){
			if(err){return next(err);}
			// Send saved comment
			res.json(comment);
		});
	});
});

// ADD UPVOTE TO COMMENT
router.put('/posts/:postId/comments/:commentId/upvote', function(req, res, next){
	console.log("----- PUT comment upvote")
		req.post.comment.upvote(function(err, comment){
			if(err){return next(err);}
			res.json(comment)
	});
});

module.exports = router;

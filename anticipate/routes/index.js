var express  = require('express');
var router   = express.Router();
var mongoose = require('mongoose');
var Post     = mongoose.model('Post');
var Comment  = mongoose.model('Comment');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/posts', function(req, res, next) {
  Post.find(function(err, posts){
    if(err){ return next(err); }

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

// Create a route for PRELOADING post objects 
// Any route with :post in it, this function will be run first. All remaining routes are some form of "/posts/:id"
// router.param(post) > return query, exec on query for promise > next() 

router.param('post', function(req, res, next, id) {
  
	console.log("--------- /post param hit: " + "\n" + "This is the id in params:" + "\n"+ id)

	// findById returns a query, not doc
  var query = Post.findById(id);

  // query.exec(callback) returns a promise
  query.exec(function (err, post){
    
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }

    console.log("post.toObject() output:" + post.toObject() )

    // Add doc on the req object
    req.post = post;
		
		console.log("----- invoke next() pass control to next matching route")

		// Passes control to the next matching route
    return next();
  });
});

// Route for returning a single post
// localhost:3000/posts/:id
router.get('/posts/:post', function(req, res) {
  console.log("/posts/:post invoked" + "\n"+"This is the document received:" + req.post)
  res.json(req.post);
});

// Add upvote route
router.put('/posts/:post/upvote', function(req, res, next){
	// invoke post's upvote() method 
	req.post.upvote(function(err, post){
		if(err){return next(err);}
		// Post should have an upvote added and saved
		res.json(post);
	});
});

// COMMENTS
router.post('/posts/:post/comments', function(req, res, next){
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



module.exports = router;

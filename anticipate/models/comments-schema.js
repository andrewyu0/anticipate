var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
	body    : String,
	author  : String,
	upvotes : {type: Number, default:0},
	post    : {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}
});

CommentSchema.methods.upvote = function(cb){
	// sets val of upvotes to itself + 1
	this.upvotes += 1;
	// saves the doc and runs cb if passed
	this.save(cb);
};

mongoose.model('Comment', CommentSchema);
var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
	title   : String,
	link    : String,
	upvotes : {
		type: Number,
		default: 0
	},
	// Comment will be an array of Comment references - set up for mongoose.populate
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	]
});


// Methods

PostSchema.methods.upvote = function(cb){
	// sets val of upvotes to itself + 1
	this.upvotes += 1;
	// saves the doc and runs cb if passed
	this.save(cb);
};

mongoose.model('Post', PostSchema);
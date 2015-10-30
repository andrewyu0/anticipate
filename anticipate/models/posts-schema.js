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

mongoose.model('Post', PostSchema);
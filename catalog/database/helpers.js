let table = require('./index.js');

// Return content by genre
let retrieveContentByGenre = (genreType) => {
	return table.Genre
	  .forge()
	  .where('name', 'LIKE', '%' + genreType + '%')
	  .query()
	  .select()
	  .then((model) => {
	  	if (model.length > 0) {
		  	let genre_id = model[0].id;
		  	return table.Content
		  	  .forge()
		  	  .where('genre_id', '=', genre_id)
		  	  .query()
		  	  .select()
		  	  .limit(10)
	  	} else {
	  		return [];
	  	}
	  })
}

// Return content
let getKeywordContent = (name) => {
	return table.knex('content')
		.where('name', 'LIKE', '%' + name + '%')
		.limit(10);
}

	// Update total views of show based on content_id
let updateViews = (content_id, callback) => {
	incrementTotal(table.Movies, content_id, 'total_views', 1, callback);
	incrementTotal(table.Seasons, content_id, 'total_views', 1, callback);
} 

	// Update total bytes of show based on content_id
let updateBytes = (content_id, bytes, callback) => {
	incrementTotal(table.Movies, content_id, 'total_bytes', bytes, callback);
	incrementTotal(table.Seasons, content_id, 'total_bytes', bytes, callback);
}

let incrementTotal = (tableName, content_id, column, num, callback) => {
	tableName
	  .query()
	  .where('content_id', '=', content_id)
	  .increment(column, num)
	  .then(() => {
	  	callback();
	  })
	   
	// table.knex(tableName)
	// 	.where('content_id', '=', content_id)
	// 	.increment(column, num)
	// 	.then(() => {
	// 		callback();
	// 	})
}


module.exports.retrieveContentByGenre = retrieveContentByGenre;
module.exports.getKeywordContent = getKeywordContent;
module.exports.updateViews = updateViews;
module.exports.updateBytes = updateBytes;

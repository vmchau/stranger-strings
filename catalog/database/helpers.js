let table = require('./index.js');
let pg = require('pg');
let connection = 'postgres://postgres:rebase@localhost:5432/catalog';

let client = new pg.Client(connection);
client.connect();

// Return content by genre
async function retrieveContentByGenre(genreName) {
	let genre_id = await client.query('SELECT id FROM genre WHERE name=$1', [genreName]);
	return await client.query('SELECT * FROM content WHERE genre_id=$1 LIMIT 10', [genre_id.rows[0].id]);
}

// Return content
async function getKeywordContent(name) {
	return await client.query('SELECT * FROM content WHERE name LIKE $1 LIMIT 10', ['%' + name +'%']);
}

	// Update total views of show based on content_id
async function updateViews (content_id) {
	let movies = await table.knex('movies').where({content_id}).select();
	if (movies.length > 0) {
		return incrementMovieViews(content_id, 1);
	} else {
		// Need content_id, seasons_id, show name
		return incrementShow('seasons', content_id, 'total_views', 1);
	}
} 

async function incrementMovieViews(content_id, num) {
	return await client.query('UPDATE movies SET total_views=total_views+$1 WHERE content_id=$2', [num, content_id]);
}
	// Update total bytes of show based on content_id
let updateBytes = (content_id, bytes) => {
	incrementTotal(table.Movies, content_id, 'total_bytes', bytes, callback);
	incrementTotal(table.Seasons, content_id, 'total_bytes', bytes, callback);
}

// FASTER but causes error%(25-30) sometimes in jmeter
// let incrementMovieViews = (content_id, num) => {
// 	return table.knex('movies')
// 			.where('content_id', '=', content_id)
// 			.increment('total_views', num)  
// }


// let incrementMovieViews = (content_id, num) => {
// 	return client.query('UPDATE movies SET total_views=total_views+$1 WHERE content_id=$2', [num, content_id]);
// }

let incrementShow = (content_id, column, num) => {

}

module.exports.retrieveContentByGenre = retrieveContentByGenre;
module.exports.getKeywordContent = getKeywordContent;
module.exports.updateViews = updateViews;
module.exports.updateBytes = updateBytes;

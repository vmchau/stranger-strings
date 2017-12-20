const express = require('express');
const body = require('body-parser');
const app = express();
const PORT = 8080;
const HOST = 'localhost';
app.use(body.json());


let table = require('../database/index.js')
let elastic = require('./elasticSearch.js');
let helpers = require('../database/helpers.js');

// Getting content by a specific genre
app.get('/genre', (req, res) => {
	let {genre} = req.body;
	retrieveContentByGenre(genre, res);
});

// Get content by keyword
app.get('/keywordContent', (req, res) => {
	let {content} = req.body;
	keywordContent(content, res);
});

// Update total views of 1 show => Set up q later to update multiple at time
app.patch('/updateViews', (req, res) => {
	let {content_id} = req.body;
	// updateViews(content_id, res);

	helpers.updateViews(content_id, function() {
		res.send();
	});
});


// Update total bytes of 1 show
app.post('/updateBytes', (req, res) => {
	let {content_id, bytes} = req.body;
	helpers.updateBytes(content_id, bytes, function() {
		res.send();
	});
})

async function retrieveContentByGenre(genre, res) {
	let cont = await helpers.retrieveContentByGenre(genre);
	res.send(cont);
}

async function keywordContent(content, res) {
	let cont = await helpers.getKeywordContent(content.toLowerCase());
	res.send(cont);
}

async function updateViews(content_id, res) {
	await helpers.updateViews(content_id);
	res.send();
}

async function updateBytes(content_id, bytes, res) {
	await helpers.updateBytes(content_id, bytes);
	res.send();
}

// Connect to port 
app.listen(PORT, HOST, function() {
	console.log(`Running on http://${HOST}:${PORT}`);
});







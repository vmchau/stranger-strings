const genre = require('../data/genre'); 

// For movie generation
const moviesOne = require('../data/movie_titlesOne.json');
const moviesTwo = require('../data/content_titlesTwo.json');
const moviesThree = require('../data/movie_titlesThree.json');

const movies = [];
//length of moviesOne
//length of moviesTwo
//length of moviesThree

//function that takes a max and min and generates an integer between that num
//function that takes the three random num, does a lookup and concats



const numGen = (max, min) => (
  Math.floor(Math.random() * (max - min) + min)
)

const movieGen = () => {
    let num1 = numGen(0, 1000);
    let num2 = numGen(0, 1000); 
    let num3 = numGen(0, 10); 

    return moviesOne[num1].name.toLowerCase() + 
               moviesTwo[num2].name.toLowerCase() + 
               moviesThree[num3].name.toLowerCase(); 
}

exports.seed = function(knex, Promise) {

  let catalogPromises = [];
  return knex('genre').del()
    // Populate genre table
    .then(() => {
      console.log('Inserting genre entries');
      for (let i = 0; i < genre.length; i++) {
        catalogPromises.push(createGenre(knex, genre[i]));
      }
     return Promise.all(catalogPromises);
    })
    // Populate content table
    .then(() => {
      let batch = [];
      console.log('Inserting 1.5 mil content entries');
      for (var i = 0; i < 1500000; i++) {
        var obj = generateRandomContentVars();
        obj.name = movieGen();
        batch.push(obj);
      }
      return knex.transaction(function(tr) {
        return knex.batchInsert('content', batch)
        .transacting(tr)
      })
    })
    .then(() => {
      let batch = [];
      console.log('Inserting 3 mil content entries');
      for (var i = 1500000; i < 3000000; i++) {
        var obj = generateRandomContentVars();
        obj.name = movieGen();
        batch.push(obj);
      }
      return knex.transaction(function(tr) {
        return knex.batchInsert('content', batch)
        .transacting(tr)
      })
    })

    // Populate movies table
    .then(() => {
      let moviesBatch = [];
      console.log('Inserting 1.4 mil movie entries');
      for (var i = 0; i < 1400000; i++) {
        var obj = generateShowVars();
        obj.name = movieGen();
        obj.content_id = i + 1;
        obj.box_shot = 'imgur.com/' + generateBoxShot();
        moviesBatch.push(obj);
      }
      return knex.transaction(function(tr) {
        return knex.batchInsert('movies', moviesBatch)
        .transacting(tr);

      })
    })
    .then(() => {
      let moviesBatch = [];
      console.log('Inserting 2.5 movie entries');
      for (var i = 1400000; i < 2800000; i++) {
        var obj = generateShowVars();
        obj.name = movieGen();
        obj.content_id = i + 1;
        obj.box_shot = 'imgur.com/' + generateBoxShot();
        moviesBatch.push(obj);
      }
      return knex.transaction(function(tr) {
        return knex.batchInsert('movies', moviesBatch)
        .transacting(tr);

      })
    })


    // Populate seasons table
    .then(() => {
      let seasonsBatch = [];
      console.log('Inserting 200k seasons entries');
      for (var i = 2800000; i < 3000000; i++) {
        // var obj = generateShowVars();
        var obj = {};
        obj.season_number = RNG(1, 11);
        obj.is_original = isOriginal();
        obj.box_shot = 'imgur.com/' + generateBoxShot();
        obj.content_id = RNG(2800000, 3000000);
        seasonsBatch.push(obj);
      }

      return knex.transaction(function(tr) {
        return knex.batchInsert('seasons', seasonsBatch)
        .transacting(tr);

      })
    })
    // Populate shows table
    .then(() => {
      let showsBatch = [];
      console.log('Inserting 2 mil show entries');
      for (var i = 0; i < 2000000; i++) {
        let obj = generateEpisode();
        showsBatch.push(obj);
      }
      return knex.transaction(function(tr) {
        return knex.batchInsert('shows', showsBatch)
        .transacting(tr);
      })
    })
    .then(() => {
      let showsBatch = [];
      console.log('Inserting 4 mil show entries');
      for (var i = 2000000; i < 4000000; i++) {
        let obj = generateEpisode();
        showsBatch.push(obj);
      }
      return knex.transaction(function(tr) {
        return knex.batchInsert('shows', showsBatch)
        .transacting(tr);
      })
    })
};


const createGenre = (knex, genre) => {
  return knex('genre').insert({
    name: genre
  });
}

const generateRandomContentVars = () => {
  var obj = {};
  obj.genre_id = RNG(1, genre.length + 1);
  obj.year = RNG(1920, 2018);
  return obj;
}

const generateEpisode = () => {
  var obj = {};
  // obj.name = movies[RNG(0, 10000000)];
  obj.name = movieGen();
  obj.run_time = RNG(30, 120);
  obj.total_bytes = RNG(100, 1000);
  obj.total_views = RNG(100, 30000);
  obj.seasons_id = RNG(1, 200001);
  return obj;
}

const generateShowVars = () => {
  var obj = {};
  obj.run_time = RNG(20, 130);
  obj.total_bytes = RNG(100, 1000);
  obj.is_original = isOriginal();
  obj.total_views = RNG(100, 30000);
  return obj;
}

const isOriginal = () => {
  return RNG(0, 10) > 7;
}

const RNG = (min, max) => {
  let num = Math.floor(Math.random() * (max - min) + min);
  return num;
}

const generateLetter = () => {
  var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
                 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  return letters[RNG(0, 26)];
}

const generateNum = () => {
  var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return numbers[RNG(0, 10)];
  
}

const generateBoxShot = () => {

  var string = '';
  for (var i = 0; i < 10; i++) {
    if (i % 2 === 0) {
      string += generateLetter();
    } else {
      string += generateNum();
    }
  }
  return string;
}
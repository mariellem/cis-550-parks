var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */

/* Lets test the DB connection */
function getPlaces(req, res) {
	var query = `
    SELECT * FROM places
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function getParkNames(req, res) {
	var query = `
    SELECT name FROM park_details
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function getAllParkDetails(req, res) {
	var query = `
    SELECT * FROM park_details
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function getParkDetails(req, res) {
  var inputPark = req.params.parkInput;
  var query = `
    SELECT *
    FROM park_details pd 
    WHERE pd.name = '${inputPark}'
    ;  
  `;
  connection.query(query, function(err, rows, fields){
    if (err)console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });  
};

function getHistoricalWeather(req, res) {
	var query = `
    SELECT * FROM historical_weather LIMIT 50
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}


function getParkAttendance(req, res) {
	var query = `
    SELECT * FROM park_attendance LIMIT 50
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}


function getReviews(req, res) {
	var query = `
    SELECT * FROM reviews LIMIT 50
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function getPhotos(req, res) {
	var query = `
    SELECT * FROM photos LIMIT 50
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}



// The exported functions, which can be accessed in index.js.
module.exports = {
  getPlaces: getPlaces,
  getAllParkDetails: getAllParkDetails,
  getParkDetails: getParkDetails,
  getParkNames: getParkNames,
  getHistoricalWeather: getHistoricalWeather,
  getParkAttendance: getParkAttendance,
  getReviews: getReviews,
  getPhotos:getPhotos
}
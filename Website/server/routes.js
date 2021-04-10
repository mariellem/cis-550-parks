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
  inputPark = req.params.parkInput
	var query = `
    SELECT * FROM park_attendance 
    where parkId in (
      SELECT parkId from park_details pd
      where pd.name = '${inputPark}'
    ) and year > 2010;
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
  let inputPark = req.params.parkInput
	var query = `
    SELECT * FROM photos p 
    JOIN park_details pd 
    on p.parkId = pd.parkId
    WHERE pd.name = '${inputPark}';
  `;
  console.log(query);
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function getNearbyParks(req, res) {
  let inputPark = req.params.parkInput
  var query = `SELECT p1.name AS nearbyPark, 
  ST_Distance_Sphere( point(myPark.lng, myPark.lat), point(p1.lng, p1.lat))*.000621371192 
    AS distanceInMiles, p1.rating,  image1loc, image1credit
  FROM (SELECT * FROM park_details pd WHERE pd.name='${inputPark}') myPark 
  JOIN park_details p1 ON p1.parkId<>myPark.parkId 
  JOIN photos ph on ph.parkId = p1.parkId
  ORDER BY distanceInMiles ASC 
  LIMIT 3;`;
  
  
  console.log(query);
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

}

function getParkReviews(req, res) {
  var inputPark = req.params.parkInput;
  var query = `
    SELECT p.name, r.rating, r.text AS review, from_unixtime(r.unixTime) AS reviewDate 
    FROM reviews r JOIN places p ON p.placeId=r.placeId 
    WHERE p.name='${inputPark}'
    ORDER BY r.unixTime DESC
    LIMIT 5;
  `;
  connection.query(query, function(err, rows, fields){
    if (err)console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  });  
};

function getPark5DayWeather(req, res) {
  var inputPark = req.params.parkInput;
  var query = `
    SELECT p.name,  AVG(hw.maxTempF) as maxTemp, AVG(hw.mintempF) as minTemp, AVG(hw.avgtempF) as aveTemp, MONTH(hw.date) as mon, DAY(hw.date) as dt
    FROM historical_weather hw JOIN places p JOIN park_details pd ON p.placeId = pd.placeId AND pd.lat = hw.lat AND pd.lng = hw.lng 
    WHERE p.name = '${inputPark}' AND 
    (
      MONTH(hw.date) = MONTH(CURRENT_DATE()) AND DAY(hw.date) = DAY(CURRENT_DATE()) OR
      MONTH(hw.date) = MONTH(DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY)) AND DAY(hw.date) = DAY(DATE_ADD(CURRENT_DATE(), INTERVAL 1 DAY)) OR
      MONTH(hw.date) = MONTH(DATE_ADD(CURRENT_DATE(), INTERVAL 2 DAY)) AND DAY(hw.date) = DAY(DATE_ADD(CURRENT_DATE(), INTERVAL 2 DAY)) OR
      MONTH(hw.date) = MONTH(DATE_ADD(CURRENT_DATE(), INTERVAL 3 DAY)) AND DAY(hw.date) = DAY(DATE_ADD(CURRENT_DATE(), INTERVAL 3 DAY)) OR
      MONTH(hw.date) = MONTH(DATE_ADD(CURRENT_DATE(), INTERVAL 4 DAY)) AND DAY(hw.date) = DAY(DATE_ADD(CURRENT_DATE(), INTERVAL 4 DAY))
    )
    GROUP BY DAY(hw.date)
    ORDER BY mon, dt
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


// The exported functions, which can be accessed in index.js.
module.exports = {
  getPlaces: getPlaces,
  getAllParkDetails: getAllParkDetails,
  getParkDetails: getParkDetails,
  getParkNames: getParkNames,
  getHistoricalWeather: getHistoricalWeather,
  getParkAttendance: getParkAttendance,
  getReviews: getReviews,
  getPhotos:getPhotos,
  getNearbyParks:getNearbyParks,
  getParkReviews:getParkReviews,
  getPark5DayWeather:getPark5DayWeather
}
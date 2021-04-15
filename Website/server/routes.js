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

function getParksandStates(req, res){
	var query = `
    SELECT name, State FROM places WHERE type = "National Park";
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function getPopularParksInRegion(req, res){
  var query = `
  SELECT pl.name AS Park, AVG(a.visitors) AS "Average Visitors (per year 2012-2016)"
  FROM park_attendance a
  JOIN park_details p ON p.parkId = a.parkId 
  JOIN places pl ON p.placeId = pl.placeId 
  WHERE p.lat<37 AND p.lat>26 AND p.lng<-95 AND p.lng>-114.7 AND a.YEAR >= 2012 AND a.YEAR <= 2016
  GROUP BY p.name
  ORDER BY AVG(a.visitors) DESC
  LIMIT 3;
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
    SELECT name FROM places where type = "National Park";
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
    FROM park_details pd join places p on pd.placeId = p.placeId
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
      SELECT placeId from places pd
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
    SELECT * FROM photos ph 
    JOIN park_details pd 
    on ph.parkId = pd.placeId
    JOIN places p on p.placeId = pd.placeId
    WHERE p.name = '${inputPark}';
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
  var query = `SELECT p.name AS nearbyPark, 
  ST_Distance_Sphere( point(myPark.lng, myPark.lat), point(p1.lng, p1.lat))*.000621371192 
    AS distanceInMiles, p1.rating,  image1loc, image1credit
  FROM (SELECT places.placeId, lng, lat FROM places join park_details on places.placeId = park_details.placeId where places.name='${inputPark}') myPark 
  JOIN park_details p1 ON p1.placeId<>myPark.placeId 
  JOIN photos ph on ph.parkId = p1.parkId
  JOIN places p on p1.placeId = p.placeId
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

function getMonthNames(req, res) {
	var query = `
    SELECT DISTINCT Month(hw.date) as mo_num, 
      MONTHNAME(STR_TO_DATE(Month(hw.date),'%m')) AS month 
      FROM historical_weather hw;
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function getBestParkTempByMonth(req, res) {
  var inputMonth = req.params.monthInput;
  var query = `
    SELECT w.lat, w.lng, p.name, p.state, DATE_FORMAT(w.date,'%M') AS month, AVG(w.maxTempF) AS high, 
      AVG(w.mintempF) AS low, AVG (w.avgtempF) AS average, AVG(w.totalSnow_cm) AS snowfall, AVG(w.sunHour) AS sunHours, AVG(w.uvIndex) AS uvIndex 
    FROM historical_weather w 
    JOIN park_details pd ON w.lat=pd.lat AND w.lng=pd.lng 
    JOIN places p ON p.placeId = pd.placeId 
    WHERE MONTH(w.date) = ${inputMonth}
    GROUP BY w.lat, w.lng, MONTHNAME(w.date)
    HAVING AVG(w.avgTempF) >=50 AND AVG(w.avgTempF) <=55
    ORDER BY p.name, w.date;
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
  getParksandStates: getParksandStates,
  getPopularParksInRegion: getPopularParksInRegion,
  getAllParkDetails: getAllParkDetails,
  getParkDetails: getParkDetails,
  getParkNames: getParkNames,
  getHistoricalWeather: getHistoricalWeather,
  getParkAttendance: getParkAttendance,
  getReviews: getReviews,
  getPhotos:getPhotos,
  getNearbyParks:getNearbyParks,
  getParkReviews:getParkReviews,
  getPark5DayWeather:getPark5DayWeather,
  getMonthNames:getMonthNames,
  getBestParkTempByMonth:getBestParkTempByMonth
}
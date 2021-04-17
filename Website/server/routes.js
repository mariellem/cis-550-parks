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
  console.log("inside Popular function")
  var inputRegion = req.params.regionInput;
  console.log("current inputRegion after function set: ")
  console.log(inputRegion)
  if (inputRegion == 1) {
    // Lat/Lng Pacific Region
    var lowLat = 32.6
    var highLat = 49
    var lowLng = -125.3
    var highLng = -117
  } else if (inputRegion == 2) {
    // Lat/Lng Rocky Mountain Region
    var lowLat = 36.7
    var highLat = 49
    var lowLng = -119
    var highLng = -103
  } else if (inputRegion == 3) {
    // Lat/Lng Southwest Region
    var lowLat = 26
    var highLat = 37
    var lowLng = -114.7
    var highLng = -95
  } else if (inputRegion == 4) {
    // Lat/Lng Midwest Region
    var lowLat = 36.5
    var highLat = 49
    var lowLng = -104
    var highLng = -81
  } else if (inputRegion == 5) {
    // Lat/Lng Northeast Region
    var lowLat = 39.5
    var highLat = 47.5
    var lowLng = -80.5
    var highLng = -66.7
  } else if (inputRegion == 6) {
    // Lat/Lng Southeast Region
    var lowLat = 25.2
    var highLat = 39.5
    var lowLng = -94.5
    var highLng = -74
  } else {
    // All Parks
    var lowLat = 6
    var highLat = 74
    var lowLng = -168
    var highLng = -43
  } 
  console.log("low lat is now:  ")
  console.log(lowLat)
  var inputRegion = 0
  console.log("inputRegion after reset to 0: ")
  console.log(inputRegion)
  var query = `
  SELECT pl.name AS Park, AVG(a.visitors) AS Visitors, ph.image1loc AS imageUrl , ph.image1credit AS credit
  FROM park_attendance a
  JOIN park_details p ON p.placeId = a.placeId 
  JOIN places pl ON p.placeId = pl.placeId 
  JOIN photos ph ON p.placeID = ph.placeid
  WHERE p.lat<'${highLat}' AND p.lat> '${lowLat}'AND p.lng<'${highLng}' AND p.lng>'${lowLng}' AND a.YEAR >= 2012 AND a.YEAR <= 2016
  GROUP BY p.name
  ORDER BY AVG(a.visitors) DESC
  LIMIT 5;
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
    where placeId in (
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
    on ph.placeId = pd.placeId
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
  JOIN photos ph on ph.placeId = p1.placeId
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

function getMonthlyTrends(req, res) {
  var inputMonth = req.params.monthInput;
  var query = `
  select p.name, Month(hw.date) AS mo_num, Year(hw.date) AS year, AVG(hw.mintempF) as min_TempF, AVG(hw.maxTempF) as max_TempF, SUM(totalSnow_cm) as total_snow, pa.visitors / 12 as visitors 
  from park_attendance pa join park_details pd on pa.placeId = pd.placeId 
  join historical_weather hw on hw.lat = pd.lat and hw.lng = pd.lng and pa.year = Year(hw.date)
  join places p on p.placeId = pd.placeId
  where Month(hw.date) = ${inputMonth}
  group by pd.name, Month(hw.date), year(hw.date)
  order by visitors desc;`;

  connection.query(query, function(err, rows, fields){
    if (err)console.log(err);
    else {
      console.log(rows);
      res.json(rows);
    }
  }); 
  

};

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
  getBestParkTempByMonth:getBestParkTempByMonth,
  getMonthlyTrends:getMonthlyTrends
}
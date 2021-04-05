const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */

app.get('/places', routes.getPlaces);

app.get('/parkNames', routes.getParkNames);

app.get('/parkDetails/:parkInput', routes.getParkDetails);

app.get('/allParkDetails', routes.getAllParkDetails);

app.get('/historicalWeather', routes.getHistoricalWeather);

app.get('/parkAttendance', routes.getParkAttendance);

app.get('/reviews', routes.getReviews);

app.get('/photos/:parkInput', routes.getPhotos);

app.get('/nearbyParks/:parkInput', routes.getNearbyParks);

app.get('/parkReviews/:parkInput', routes.getParkReviews);

app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});
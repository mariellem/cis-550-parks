import React from 'react';
import PageNavbar from './PageNavbar';
import WeatherDetailRow from './WeatherDetailRow';
import '../style/NPFinder.css';
import 'bootstrap/dist/css/bootstrap.min.css';


var trendsMap = {}; //used for caching the park trends

class Plot extends React.Component {
	componentDidMount() {
	//   if (!window.google || !window.google.maps) {
		console.log('Hello world');
		
		const $script = require(`chartjs`);
		$script(
			<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>,
		  	this.handlePlotLoad
		);
	//   }
	}
	// componentDidUpdate(prevProps) {
	// 	// @TODO fix update to load things
 	//   const { position } = this.props;
	//   if (prevProps.position !== position) {
	// 	this.map && this.map.setCenter(position[0]);
	// 	for (var i = 0; i < position.length; i++) {
	// 		this.marker && this.marker.setPosition(position[i]);
	// 	}
	//   }
	// }
  
	handlePlotLoad = () => {
		
	// 	const { position } = this.props;
	//   const {detail} = this.props;
	  const config = {
		type: 'line',
		type: 'bar',
    	data: {
        	labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        	datasets: [{
				label: '# of Votes',
				data: [12, 19, 3, 5, 2, 3],
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(255, 159, 64, 0.2)'
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)'
				],
				borderWidth: 1
			}]
		},
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			}
		}
		};

	this.myChart = new Chart(
		document.getElementById('myChart'),
		config
	);
	console.log(this.myChart);
    	
	};
  
	render() { // @TODO why doesnt this work??
	  return <canvas id="myChart" width="800" height="400"></canvas>
	  //<div style={{ height: "350px" }} ref={ref => (this.myChart = ref)} />;
	}
  }





class GoogleMap extends React.Component {
	componentDidMount() {
	  if (!window.google || !window.google.maps) {
		const { googleKey } = this.props;

		const $script = require(`scriptjs`);
		$script(
		  `https://maps.googleapis.com/maps/api/js?key=${googleKey}`,
		  this.handleGoogleLoad
		);
	  }
	}
	componentDidUpdate(prevProps) {
		// @TODO fix update to load new markers in map 
 	  const { position } = this.props;
	  if (prevProps.position !== position) {
		this.map && this.map.setCenter(position[0]);
		for (var i = 0; i < position.length; i++) {
			this.marker && this.marker.setPosition(position[i]);
		}
	  }
	}
  
	handleGoogleLoad = () => {
	  const { position } = this.props;
	  const {detail} = this.props;

	  var infoWindowContent = [];
	  for (var j = 0; j < position.length; j++) {
		const var2 = 'abc'; //@TODO make this work
		infoWindowContent.push(['<div class="info_content">' +'<h3>'+ 'The London Eye' +'</h3>' + '<p>abcd.</p>' +        '</div>']);

	  }
    
	  this.map = new window.google.maps.Map(this.mapRef, {
		scaleControl: true,
		center: null,
		zoom: 2
	  });

	  var infoWindow = new window.google.maps.InfoWindow(), marker, i;

	  var bounds = new window.google.maps.LatLngBounds();

	  for (var i = 0; i < position.length; i++) {
		bounds.extend(position[i]);

	 	this.marker = new window.google.maps.Marker({
			map: this.map,
			position: position[i]}
		);
	
		this.marker.setPosition(position[i]);

		// Allow each marker to have an info window    
        window.google.maps.event.addListener(this.marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(infoWindowContent[i][0]);
                infoWindow.open(this.map, marker);
            }
        })(this.marker, i));


		}
		// define map bounds using saved bounds	
	  this.map.fitBounds(bounds);

    	
	};
  
	render() {
	  return <div style={{ height: "350px" }} ref={ref => (this.mapRef = ref)} />;
	}
  }

  
 class TrendDetail extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className="trendsResults">
				<div className="name">{this.props.name}</div>
				<div className="visitors">Attendance: {Math.round(this.props.visitors)} visitors</div>
				<div className="minTempF">LOW: {Math.round(this.props.min_TempF)} degrees F </div>
				<div className="maxTempF">HIGH: {Math.round(this.props.max_TempF)} degrees F</div>
				<div className="total_snow">{Math.round(this.props.total_snow)} inches of snow</div>
				<br></br>
			</div>
		);
	}
 }

  
export default class ParkRecommendations extends React.Component {
	constructor(props) {
		super(props);
		const queryString= window.location.search
		let urlParams = new URLSearchParams(queryString)

		this.state = {
			selectedMonth: urlParams.get('month'),
			imageLink: '/public/bg.jpg',
			months: [],
			weatherDetail: [],
			positions: false,
			opacity: 0
		};

		this.submitMonth = this.submitMonth.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {

		// Send an HTTP request to the server.
		fetch("http://localhost:8081/monthNames",
		{
		  method: 'GET' // The type of HTTP request.
		}).then(res => {
		  // Convert the response data to a JSON.
		  return res.json();
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		}).then(monthList => {
		  if (!monthList) return;
		  // Map each placeObj in placeList to an HTML element:
		  let monthDivs = monthList.map((monthObj, i) =>
			<option value={monthObj.mo_num}>{monthObj.month}</option>
		  );
		  // Set the state of the place list to the value returned by the HTTP response from the server.
		   this.setState({
			months: monthDivs
		   });
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		});
		if (this.state.selectedMonth != null) {
			this.submitMonth()
		}
		
	}

	handleChange(e) {
		this.setState({
			selectedMonth: e.target.value
		});
	}
	
	submitMonth() {
		console.log("Submitted the month")
		console.log(this.state.selectedMonth)
		let monthInput = this.state.selectedMonth;
		if (monthInput == "true" || monthInput == null) {
			this.setState({
				opactiy: 0
			})
		} else {
			this.setState({
				opacity: 1
			})
		}
		
		// get results of query for recommended parks by month
		// @TODO write info box on page to explain results
		var locsArray = [];
		fetch("http://localhost:8081/recommendations/" + monthInput,
		{
			method: "GET"
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(weatherList => {
			// add each result lat,long to array for map markers				
			for (var i = 0; i < weatherList.length; i++) {	
				locsArray.push({ lat: Number(weatherList[i].lat), lng: Number(weatherList[i].lng) });
			}
    		let weatherDivs = weatherList.map((weatherDetailObj, i) => 
				<WeatherDetailRow 
					name={weatherDetailObj.name} 
					state={weatherDetailObj.state} 
					high={weatherDetailObj.high} 
					low={weatherDetailObj.low} 
					average={weatherDetailObj.average} 
					sunHours={weatherDetailObj.sunHours} 
					snowfall={weatherDetailObj.snowfall} 
					uvIndex={weatherDetailObj.uvIndex} 
					month = {weatherDetailObj.month}/>
			);
		
	
		//This saves our HTML representation of the data into the state, which we can call in our render function
		this.setState({
			weatherDetail: weatherDivs,
			positions: locsArray
		});
    	}, err => {
     	 	console.log(err);
		});
		
		//fetch the weather and attendance trends
		if ( (String(monthInput) in trendsMap)) { 
			this.setState({
				trend: trendsMap[monthInput]
			});
		}
		else {
			console.log("Fetching Trends");
			fetch("http://localhost:8081/trends/" + monthInput,
		{
			method: "GET"
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(trendList => {
			console.log("Fetching trend for month:");
			console.log(trendList);

			let trendDivs = trendList.map((trendDetailObj, i) => 
				<TrendDetail  
					name={trendDetailObj.name} 
					visitors={trendDetailObj.visitors} 
					min_TempF={trendDetailObj.min_TempF} 
					max_TempF={trendDetailObj.max_TempF} 
					total_snow={trendDetailObj.total_snow}/>
			);

			trendsMap[monthInput] = trendDivs; //"Month is " + monthInput;
			// console.log(trendsMap[monthInput]);

			this.setState({
				trend: trendsMap[monthInput]
			});
    	}, err => {
     		console.log(err);
    	});
		
	}



		// //Fetch the park attendance information
		// fetch("http://localhost:8081/parkAttendance/" + parkInput,
		// {
		// 	method: "GET"
		// }).then(res => {
		// 	return res.json();
		// }, err => {
		// 	console.log(err);
		// }).then(parkVisitors => {
		// 	//save the image and park details to a park info box object
		// 	let attendance = parkVisitors.map((parkObj, i) =>
		// 	<ParkAttendance year={parkObj.year} visitors={parkObj.visitors}/>
		// 	);
		// 	//update the state to have the park image
		// 	this.setState({
		// 		parkAttendance: attendance
		// 	})
		// 	console.log(this.state.parkAttendance)

		// }, 
		// err => {
		// 	console.log(err)
		// });

		// //Fetch the park reviews
		// fetch("http://localhost:8081/parkReviews/" + parkInput,
		// {
		// 	method: "GET"
		// }).then(res => {
		// 	return res.json();
		// }, err => {
		// 	console.log(err);
		// }).then(parkReviews => {
		// 	console.log(parkReviews);
		// 	//save the image and park details to a park info box object
		// 	let parkReview = parkReviews.map((parkRevObj, i) =>
		// 	<ParkReviewRow date = {parkRevObj.reviewDate} rating={parkRevObj.rating} review={parkRevObj.review}/>
		// 	);
		// 	//update the state to have the park image
		// 	this.setState({
		// 		parkReviews: parkReview
		// 	})
			

		// }, 
		// err => {
		// 	console.log(err)
		// });

		// // Fetch the park 5 day weather
		// fetch("http://localhost:8081/park5DayWeather/" + parkInput,
		// {
		// 	method: "GET"
		// }).then(res => {
		// 	return res.json();
		// }, err => {
		// 	console.log(err);
		// }).then(park5DayWeathers => {
		// 	console.log(park5DayWeathers);
		// 	let park5DW = park5DayWeathers.map((park5DWObj, i) =>
		// 	<ParkWeatherRow mon = {park5DWObj.mon} dt={park5DWObj.dt} minTemp={park5DWObj.minTemp} maxTemp={park5DWObj.maxTemp} aveTemp={park5DWObj.aveTemp}/>
		// 	);
		// 	this.setState({
		// 		park5DayWeathers: park5DW
		// 	})
			

		// }, 
		// err => {
		// 	console.log(err)
		// });



	}

	
	render() {
		
		console.log("Selected month is:")
		console.log(this.state.selectedMonth)
		let hStyle = {
			"text-align": 'center',
			"text-transform": 'uppercase',
			"opacity":this.state.opacity,
		};
		let tStyle = {
			"opacity":this.state.opacity,
		};
		
		const monthNames = ["January", "February", "March", "April", "May", "June", 
				"July", "August", "September", "October", "November", "December"];

		var chosenMonth = monthNames[this.state.selectedMonth-1];

		return (

			<div className="ParkRecommendations" style={{ 	backgroundImage: `url(${this.state.imageLink})`, backgroundSize: 'cover'}}>
			
		{/* @TODO figure out how to call plot */}
			<Plot  /> 

			<PageNavbar active="Finder" />
			

			<div className="container np-container">
			  <div className="jumbotron1">
				<div className="h3">Trip Planner  </div>

				<div className="years-container">
				  <div className="dropdown-container">
					  Find the best parks to visit in the month of: 	   
					<select value={this.state.selectedMonth} onChange={this.handleChange} className="dropdown" id="parksDropdown">
						<option select value> -- select a month -- </option>
						{this.state.months}
					</select>
					<button className="submit-btn" id="decadesSubmitBtn" onClick={this.submitMonth}>Search</button>
				  </div>
				</div>
			  </div>

			  <div className="container movies-container">
          	<hr />
			
			{this.state.positions ? (
				<GoogleMap position={this.state.positions}
					detail = {this.state.weatherDetail}
					googleKey={"AIzaSyDIVLDtctP_dXPybzkrHX0yxGnt2yGm7BQ"} />
				) : (
				<div>missing month input</div>
			)}

          <div className="jumbotron">
            <div className="movies-container">
              <div className="movies-header">
				  
              <h2 style={hStyle}>Recommended Parks in  {chosenMonth}</h2>
              </div>
              <div className="results-container" id="results">
                {/* {this.state.weatherDetail} */}
              </div>
			  <div>The trend is: {this.state.trend}</div>
			  <Plot  />
            </div>
          </div>
		  
        </div>
		
		
			  {/* <div className="container movies-container">
				<div className="jumbotron">
				<div className="parks-container">
				  <div className="weather-header">
					<div className="header-lg"><strong>Park</strong></div>
					<div className="header"><strong>Address</strong></div>
					<div className="header"><strong>Phone Number</strong></div>
					<div className="header"><strong>Rating</strong></div>
					<div className="header"><strong>Rating</strong></div>
					<div className="header"><strong>Rating</strong></div>
					<div className="header"><strong>Rating</strong></div>
					<div className="header"><strong>Rating</strong></div>
					<div className="header"><strong>Rating</strong></div>
					<div className="header"><strong>Rating</strong></div>
					<div className="header"><strong>Rating</strong></div>
				  </div>
				  <div className="parks-container" id="parkResults">
					{this.state.weatherDetail}
				  </div>
				</div>
			  </div>
			  </div> */}

			  {/* <table style ={tStyle} class="upper">
				<td class="mp-left">
				<section>
					
					
							<h2 style={hStyle}>NEARBY PARKS</h2>
							<div className="infobox" id="parkResults" align="center">
							  {this.state.nearbyParks}
							</div>
					    
					</section> 

				</td>
				<td class="mp-bordered"></td>
				<td class="mp-right">
				<section>
				  
				  <h2 style={hStyle}>Selected Park</h2>
				  		<div className="infobox" id="parkResults" align="center">
			            	{this.state.parkPhoto}
			          	</div>
				  
				  </section>
				 
				</td>
				



			  </table> */}
			  			
				
			  
			</div>
		</div>
		);
	}
}

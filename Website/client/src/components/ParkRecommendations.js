import React from 'react';
import Plot from 'react-plotly.js';

import PageNavbar from './PageNavbar';
// import WeatherDetailRow from './WeatherDetailRow';
import '../style/ParkRecs.css';
import 'bootstrap/dist/css/bootstrap.min.css';


var trendsMap = {}; //used for caching the park trends

class GoogleMap extends React.Component {
	constructor(props) {
		super(props);
		this.markers = [];
	}
	
	componentDidMount() {
	  // called on creation of map
	  if (!window.google || !window.google.maps) {
		const { googleKey } = this.props;

		const $script = require(`scriptjs`);
		$script(
		  `https://maps.googleapis.com/maps/api/js?key=${googleKey}`,
		  this.handleGoogleLoad
		  
		);
	  }
	}
	  
	handleGoogleLoad = () => {
		this.map = new window.google.maps.Map(this.mapRef, {
			scaleControl: true,
			center: null,
			zoom: 2
		});
		this.addMarkers();
	  };

	addMarkers(){
		// helper function to add markers to map
		const { position, parkNames } = this.props;

		var infoWindow = new window.google.maps.InfoWindow(), marker, i;
		var infoWindowContent = [];

		

		for (var j = 0; j < parkNames.length; j++) {
			let redirect = "\Finder\?park="+parkNames[j];
			infoWindowContent.push(['<div class="info_content">' +`<h2><a href=${redirect} target="blank">${parkNames[j]}</a></h2>`+ '<p>abcd.</p>' +        '</div>']);

		}
		var bounds = new window.google.maps.LatLngBounds();
		
		// for each query result, populate markers
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
			
			this.markers.push(this.marker)
		  }
		// define map bounds using saved bounds	
		this.map.fitBounds(bounds);

		return
	}
	

	componentDidUpdate() {
		// called on update to page
	   const { position, prevposition } = this.props;
	   // check if the query output has changed, which reflects input month change
	   var is_same = true;
	   if (prevposition!=false){
		   	// array equality requires element wise and length comparison
			is_same = (prevposition.length == position.length) && prevposition.every(function(element, index) {
				return element === position[index]; 
			});
	   }
	   
	   if (!is_same){
			// if month has changed, markers should change to reflect query res
			// clear old markers
			for (let i = 0; i < this.markers.length; i++) {
				this.markers[i].setMap(null);
			}
			this.markers = [];
			// add new markers
			this.addMarkers();

	   }

	}

  	render() {
		// render map results
		return <div style={{ height: "550px" }} ref={ref => (this.mapRef = ref)} />;
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
			prevpositions: false,
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
			<option key={monthObj.mo_num} value={monthObj.mo_num}>{monthObj.month}</option>
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
		var nameArray = [];
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
				nameArray.push(weatherList[i].name);
			}
    		// let weatherDivs = weatherList.map((weatherDetailObj, i) => 
			// 	<WeatherDetailRow 
			// 		name={weatherDetailObj.name} 
			// 		state={weatherDetailObj.state} 
			// 		high={weatherDetailObj.high} 
			// 		low={weatherDetailObj.low} 
			// 		average={weatherDetailObj.average} 
			// 		sunHours={weatherDetailObj.sunHours} 
			// 		snowfall={weatherDetailObj.snowfall} 
			// 		uvIndex={weatherDetailObj.uvIndex} 
			// 		month = {weatherDetailObj.month}/>
			// );
		
		//iterate over all markers in the map and call them null
		// save previous positions
		if (this.state.positions!=false){
			this.setState({
				prevpositions: this.state.positions
			});
		}
	
		//This saves our HTML representation of the data into the state, which we can call in our render function
		this.setState({
			resParkNames: nameArray,
			positions: locsArray
		});
    	}, err => {
     	 	console.log(err);
		});
		
		//fetch the weather and attendance trends
		if ( (String(monthInput) in trendsMap)) { 
			// if results are already cached, load from memory instead of re-querying db
			this.setState({
				trend: trendsMap[monthInput]
			});
		}
		else {
			var parkNameArr = [];
			var visitorArr = [];
			var minTempArr = [];
			var maxTempArr = [];
			var totalSnowArr = [];
			// console.log("Fetching Trends");
			fetch("http://localhost:8081/trends/" + monthInput,
		{
			method: "GET"
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(trendList => {
			
			// console.log("Fetching trend for month:");
			// console.log(trendList)
		
			for (var key in trendList) {	
				parkNameArr.push(trendList[key].name)
				visitorArr.push(trendList[key].visitors)
				minTempArr.push(trendList[key].min_TempF)
				maxTempArr.push(trendList[key].max_TempF)
				totalSnowArr.push(trendList[key].total_snow)

			}

			// save array of arrays into trendsMap to cache results in case of reload
			trendsMap[monthInput] = [parkNameArr, visitorArr, minTempArr, maxTempArr, totalSnowArr]; 

			this.setState({
				trend: trendsMap[monthInput]
			});
    	}, err => {
     		console.log(err);
    	});
		
	}

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

			<PageNavbar active="Finder" />

			{/* drop down menu options - choose month */}
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
				<GoogleMap
					prevposition={this.state.prevpositions}
					position={this.state.positions}
					parkNames = {this.state.resParkNames}
					googleKey={"AIzaSyDIVLDtctP_dXPybzkrHX0yxGnt2yGm7BQ"} />
				) : (
				<div>missing month input</div>
			)}
		
          <div className="jumbotron">
            <div className="parks-container">
              <div className="parks-header">
				  
              <h2 style={hStyle}>Recommended Parks in  {chosenMonth}</h2>
              </div>
              {/* <div className="results-container" id="results"> */}
                {/* {this.state.weatherDetail} */}
              {/* </div> */}
			  {this.state.trend ? (
				<div>
				{/* // weather plot */}
				<Plot
					data={[
					{
						x: this.state.trend[0],
						y: this.state.trend[2],
						type: 'bar',
						name: 'low'
					},
					{
						x: this.state.trend[0],
						y: this.state.trend[3],
						type: 'bar',
						name: 'high'
					},
					{
						x: this.state.trend[0],
						y: this.state.trend[4],
						type: 'scatter',
						mode: 'markers',
						marker: {color: 'cornflowerblue',  symbol: 'circle-open', size: 10},
						name: 'snowfall',
						yaxis:'y2'
					}
					]}
					layout={{
						paper_bgcolor: 'rgba(0,0,0,0)',
						plot_bgcolor: 'rgba(0,0,0,0)',
						barmode:"group",
						width: 1200, 
						height: 700, 
						title: 'Weather by Park in X',
						xaxis: {
							title: {
								text: 'National Park',
							},
							automargin: true
						},
						yaxis: {
							mirror: true, 
							title: {
								text: 'Temperature (degrees F)',
							},
							overlaying:'y2',
							range: [-20,120], 
						},
						yaxis2: {
							title: 'Amount of Snowfall (inches)',
							titlefont: {color: 'cornflowerblue'},
							tickfont: {color: 'cornflowerblue'},
							side: 'right',
							showgrid: false, 
							range: [-20,120]
						},
						legend: {
							x: 1,
							xanchor: 'right',
							y: 1
						}
					}}
				/>

				{/* // visitor plot */}
				<Plot
					data={[
					{
						x: this.state.trend[0],
						y: this.state.trend[1],
						type: 'scatter',
						mode: 'markers',
						marker: {color: 'red'},
						name: 'Number of Visitors'
					}
					// {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
					]}
					layout={{
						paper_bgcolor: 'rgba(0,0,0,0)',
  						plot_bgcolor: 'rgba(0,0,0,0)',
						width: 1200, 
						height: 700, 
						title: 'Monthly Attendance by Park',
						xaxis: {
							title: {
								text: 'National Park',
							},
							showgrid: false, 
							automargin: true
						},
						yaxis: {
							title: {
								text: 'Park Attendance (monthly)',
							},
							showgrid: false, 
							automargin: true
						}
					}}
					/>

					</div>
					) : (
						<div>missing month input</div>
				)}
            </div>
          </div>
		  
        </div>
		
 
		</div>
	</div>);
	}
}

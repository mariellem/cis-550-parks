import React from 'react';
import PageNavbar from './PageNavbar';
import WeatherDetailRow from './WeatherDetailRow';
import '../style/NPFinder.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// const map = new window.google.maps
class GoogleMap extends React.Component {
	componentDidMount() {
	  if (!window.google || !window.google.maps) {
		const { googleKey } = this.props;
		// require is not working inside stackoverflow snippets
		// we are using a cdn for scriptjs, you can use npm
		const $script = require(`scriptjs`);
		$script(
		  `https://maps.googleapis.com/maps/api/js?key=${googleKey}`,
		  this.handleGoogleLoad
		);
	  }
	}
  
	componentDidUpdate(prevProps) {
	  const { position } = this.props;
	  if (prevProps.position !== position) {
		this.map && this.map.setCenter(position);
		this.marker && this.marker.setPosition(position);
	  }
	}
  
	handleGoogleLoad = () => {
	  const { position } = this.props;
	  this.map = new window.google.maps.Map(this.mapRef, {
		scaleControl: true,
		center: null,
		zoom: 5
	  });
	  for (var i = 0; i < position.length; i++) {
		console.log("value");
	  }
	  this.marker = new window.google.maps.Marker({
		map: this.map,
		position: position
	  });
  
	  this.map.setCenter(position);
	  this.marker.setPosition(position);
	};
  
	render() {
	  return <div style={{ height: "350px" }} ref={ref => (this.mapRef = ref)} />;
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
			latitudes: [0],
			longitudes: [0],
			opacity: 0
		};
		// this.loadScript = this.loadScript.bind(this);

		this.submitMonth = this.submitMonth.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	// onInputChange = ({ target }) => {
	// 	this.setState({ [target.name]: target.value });
	//   };
	// state = { lat: 40.741895, lng: -73.989308, googleKey: "" };

	// loadScript(){

	// 	const API_KEY = "AIzaSyDIVLDtctP_dXPybzkrHX0yxGnt2yGm7BQ";		//process.env.REACT_APP_API_KEY;
	// 	const url = "https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places";
		
	// 	const s = document.createElement("script");
	// 	s.src=url;
	// 	document.head.appendChild(s);
	// }

	componentDidMount() {
		// this.loadScript();

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
		// console.log(typeof(this.state.selectedMonth))
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
		// console.log("opacity is:")
		// console.log(this.state.opacity)
		
		//| lat     | lng      | name    | state | month    | high  | low    | average     | snowfall    | sunHours           | uvIndex |
		var latArray = [];
		var lngArray = [];
		fetch("http://localhost:8081/recommendations/" + monthInput,
		{
			method: "GET"
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(weatherList => {
			console.log(weatherList); //displays your JSON object in the console
			// console.log(weatherList[0].lat);
			for (var i = 0; i < weatherList.length; i++) {
				latArray.push(weatherList[i].lat);
				lngArray.push(weatherList[i].lng);
			}
			for (var j = 0; j < latArray.length; j++) {
				console.log(latArray[j]);
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
			latitudes: latArray,
			longitudes: lngArray
		});
    	}, err => {
     	 // Print the error if there is one.
     	 console.log(err);
    	});
		




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


		return (

			
			<div className="ParkRecommendations" style={{ 	backgroundImage: `url(${this.state.imageLink})`, backgroundSize: 'cover'}}>
			<PageNavbar active="Finder" />


				{/* <d=-iv> */}
				
				{/* <div>Change coords</div>
				<input name="lat" value={} onChange={this.onInputChange} />
				<input name="lng" value={} onChange={this.onInputChange} />
				</div>
				 */}
				
				

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
			{this.state.weatherDetail ? (
				<GoogleMap position={{ lat: Number(this.state.latitudes[0]), lng: Number(this.state.longitudes[0]) }} googleKey={"AIzaSyDIVLDtctP_dXPybzkrHX0yxGnt2yGm7BQ"} />
				) : (
				<div>missing month input</div>
			)}

          <div className="jumbotron">
            <div className="movies-container">
              <div className="movies-header">
				  
              <h2 style={hStyle}>Recommended Parks in  {monthNames[this.state.selectedMonth-1]}</h2>
              </div>
              <div className="results-container" id="results">
                {this.state.weatherDetail}
              </div>
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

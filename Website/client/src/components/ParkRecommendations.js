import React from 'react';
import PageNavbar from './PageNavbar';
import WeatherDetailRow from './WeatherDetailRow';
import ParkInfoBox from './ParkInfoBox';
import ParkSummary from './ParkSummary';
import ParkAttendance from './ParkAttendance';
import ParkReviewRow from './ParkReviewRow';
import ParkWeatherRow from './ParkWeatherRow';
import '../style/NPFinder.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class NPFinder extends React.Component {
	constructor(props) {
		super(props);
		const queryString= window.location.search
		let urlParams = new URLSearchParams(queryString)

		this.state = {
			selectedMonth: urlParams.get('month'),
			imageLink: '/public/bg.jpg',
			months: [],
			weatherDetail: [],
			parkReviews: [],
			park5DayWeathers: [],
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

	/* ---- Q3b (Best Genres) ---- */
	submitMonth() {
		console.log("Submitted the month")
		console.log(this.state.selectedMonth)
		console.log(typeof(this.state.selectedMonth))
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
		console.log("opacity is:")
		console.log(this.state.opacity)
		
		//| lat     | lng      | name    | state | month    | high  | low    | average     | snowfall    | sunHours           | uvIndex |

		fetch("http://localhost:8081/recommendations/" + monthInput,
		{
			method: "GET"
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(weatherList => {
			console.log(weatherList); //displays your JSON object in the console

    	let weatherDivs = weatherList.map((weatherDetailObj, i) => 
			<WeatherDetailRow name={weatherDetailObj.name} 
			lat={weatherDetailObj.lat} 
			lng={weatherDetailObj.lng} 
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
			weatherDetail: weatherDivs
		});
    	}, err => {
     	 // Print the error if there is one.
     	 console.log(err);
    	});
		


		//Fetch the park detail information and photo and save it to park photo
		// let image2 = "/public/bg.jpg"
		
		// fetch("http://localhost:8081/photos/" + monthInput,
		// {
		// 	method: "GET"
		// }).then(res => {
		// 	return res.json();
		// }, err => {
		// 	console.log(err);
		// }).then(parkImage => {
		// 	console.log(parkImage);
		// 	//save the image and park details to a park info box object
		// 	let parkImg = parkImage.map((imageObj, i) =>
		// 	(image2 = imageObj.image1loc,
		// 	<ParkInfoBox imageUrl={imageObj.image2loc} credit={imageObj.image2credit} name = {imageObj.name} phone={imageObj.phoneNumber} rating={imageObj.rating} location={imageObj.address} lat={imageObj.lat} lng={imageObj.lng} website={imageObj.websiteUrl}/>)
			
		// 	);
		// 	//update the state to have the park image
		// 	this.setState({
		// 		parkPhoto: parkImg,
		// 		imageLink: image2
		// 	})
		// 	console.log("Reset image Link")
		// 	console.log(this.state.imageLink)

		// }, 
		// err => {
		// 	console.log(err)
		// });


		// //Fetch the nearby park information
		// fetch("http://localhost:8081/nearbyParks/" + parkInput,
		// {
		// 	method: "GET"
		// }).then(res => {
		// 	return res.json();
		// }, err => {
		// 	console.log(err);
		// }).then(nearbyParks => {
		// 	console.log(nearbyParks);
		// 	//save the image and park details for the nearby parks
		// 	let nearbyPark = nearbyParks.map((parkObj, i) =>
		// 	<ParkSummary imageUrl={parkObj.image1loc} credit={parkObj.image1credit} name = {parkObj.nearbyPark} rating={parkObj.rating} distance={parkObj.distanceInMiles}/>
		// 	);
		// 	//update the state to have the park image
		// 	this.setState({
		// 		nearbyParks: nearbyPark
		// 	})
			

		// }, 
		// err => {
		// 	console.log(err)
		// });


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
		

		return (
			
			<div className="NPFinder" style={{ 	backgroundImage: `url(${this.state.imageLink})`, backgroundSize: 'cover'}}>
			<PageNavbar active="Finder" />

			<div className="container np-container">
			  <div className="jumbotron1">
				<div className="h5">Get National Park Information</div>

				<div className="years-container">
				  <div className="dropdown-container">
					<select value={this.state.selectedMonth} onChange={this.handleChange} className="dropdown" id="parksDropdown">
						<option select value> -- select an option -- </option>
						{this.state.months}
					</select>
					<button className="submit-btn" id="decadesSubmitBtn" onClick={this.submitMonth}>Search</button>
				  </div>
				</div>
			  </div>

			  <div className="container movies-container">
          <br></br>
          <div className="jumbotron">
            <div className="movies-container">
              <div className="movies-header">
                <div className="header"><strong>Name</strong></div>
                <div className="header"><strong>Lat</strong></div>
				<div className="header"><strong>Long</strong></div>
                <div className="header"><strong>State</strong></div>
                <div className="header"><strong>High Temp</strong></div>
                <div className="header"><strong>Low Temp</strong></div>
                <div className="header"><strong>Avg Temp</strong></div>
                <div className="header"><strong>sunHours</strong></div>
				<div className="header"><strong>snowfall</strong></div>
                <div className="header"><strong>UV Index</strong></div>
                <div className="header"><strong>month</strong></div>
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


import React from 'react';
import PageNavbar from './PageNavbar';
import ParkDetailRow from './ParkDetailRow';
import ParkInfoBox from './ParkInfoBox';
import ParkSummary from './ParkSummary'
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
			selectedPark: urlParams.get('park'),
			imageLink: '/public/bg.jpg',
			parks: [],
			parkDetail: [],
			parkReviews: [],
			park5DayWeathers: []
			opacity: 0
		};

		this.submitPark = this.submitPark.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {

		// Send an HTTP request to the server.
		fetch("http://localhost:8081/parkNames",
		{
		  method: 'GET' // The type of HTTP request.
		}).then(res => {
		  // Convert the response data to a JSON.
		  return res.json();
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		}).then(parkList => {
		  if (!parkList) return;
		  // Map each placeObj in placeList to an HTML element:
		  let parkDivs = parkList.map((parkObj, i) =>
			<option value={parkObj.name}>{parkObj.name}</option>
		  );
		  // Set the state of the place list to the value returned by the HTTP response from the server.
		   this.setState({
			parks: parkDivs
		   });
		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		});
		if (this.state.selectedPark != null) {
			this.submitPark()
		}
		
	}

	handleChange(e) {
		this.setState({
			selectedPark: e.target.value
		});
	}

	submitPark() {
		console.log("Submitted the park")
		console.log(this.state.selectedPark)
		console.log(typeof(this.state.selectedPark))
		let parkInput = this.state.selectedPark;
		if (parkInput == "true" || parkInput == null) {
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
		/*
		fetch("http://localhost:8081/parkDetails/" + parkInput,
		{
			method: "GET"
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(ParkList => {
			console.log(ParkList); //displays your JSON object in the console
    	let parkDivs = ParkList.map((parkDetailObj, i) => 
       	 <ParkDetailRow name={parkDetailObj.name} address={parkDetailObj.address} phoneNumber={parkDetailObj.phoneNumber} rating={parkDetailObj.rating} totalRatings = {parkDetailObj.totalRatings}/>
    	);
		//This saves our HTML representation of the data into the state, which we can call in our render function
		this.setState({
			parkDetail: parkDivs
		});
    	}, err => {
     	 // Print the error if there is one.
     	 console.log(err);
    	});
		*/


		//Fetch the park detail information and photo and save it to park photo
		let image2 = "/public/bg.jpg"
		
		fetch("http://localhost:8081/photos/" + parkInput,
		{
			method: "GET"
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(parkImage => {
			console.log(parkImage);
			//save the image and park details to a park info box object
			let parkImg = parkImage.map((imageObj, i) =>
			(image2 = imageObj.image1loc,
			<ParkInfoBox imageUrl={imageObj.image2loc} credit={imageObj.image2credit} name = {imageObj.name} phone={imageObj.phoneNumber} rating={imageObj.rating} location={imageObj.address} lat={imageObj.lat} lng={imageObj.lng} website={imageObj.websiteUrl}/>)
			
			);
			//update the state to have the park image
			this.setState({
				parkPhoto: parkImg,
				imageLink: image2
			})
			console.log("Reset image Link")
			console.log(this.state.imageLink)

		}, 
		err => {
			console.log(err)
		});


		//Fetch the nearby park information
		fetch("http://localhost:8081/nearbyParks/" + parkInput,
		{
			method: "GET"
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(nearbyParks => {
			console.log(nearbyParks);
			//save the image and park details for the nearby parks
			let nearbyPark = nearbyParks.map((parkObj, i) =>
			<ParkSummary imageUrl={parkObj.image1loc} credit={parkObj.image1credit} name = {parkObj.nearbyPark} rating={parkObj.rating} distance={parkObj.distanceInMiles}/>
			);
			//update the state to have the park image
			this.setState({
				nearbyParks: nearbyPark
			})
			

		}, 
		err => {
			console.log(err)
		});


		//Fetch the park reviews
		fetch("http://localhost:8081/parkReviews/" + parkInput,
		{
			method: "GET"
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(parkReviews => {
			console.log(parkReviews);
			//save the image and park details to a park info box object
			let parkReview = parkReviews.map((parkRevObj, i) =>
			<ParkReviewRow date = {parkRevObj.reviewDate} rating={parkRevObj.rating} review={parkRevObj.review}/>
			);
			//update the state to have the park image
			this.setState({
				parkReviews: parkReview
			})
			
		//Fetch the park attendance information
		fetch("http://localhost:8081/parkAttendance/" + parkInput,
		{
			method: "GET"
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(parkVisitors => {
			//save the image and park details to a park info box object
			let attendance = parkVisitors.map((parkObj, i) =>
			<ParkAttendance year={parkObj.year} visitors={parkObj.visitors}/>
			);
			//update the state to have the park image
			this.setState({
				parkAttendance: attendance
			})
			console.log(this.state.parkAttendance)

		}, 
		err => {
			console.log(err)
		});


		}, 
		err => {
			console.log(err)
		});

				//Fetch the park reviews
		fetch("http://localhost:8081/parkReviews/" + parkInput,
		{
			method: "GET"
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(parkReviews => {
			console.log(parkReviews);
			//save the image and park details to a park info box object
			let parkReview = parkReviews.map((parkRevObj, i) =>
			<ParkReviewRow date = {parkRevObj.reviewDate} rating={parkRevObj.rating} review={parkRevObj.review}/>
			);
			//update the state to have the park image
			this.setState({
				parkReviews: parkReview
			})
			

		}, 
		err => {
			console.log(err)
		});

		// Fetch the park 5 day weather
		fetch("http://localhost:8081/park5DayWeather/" + parkInput,
		{
			method: "GET"
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(park5DayWeathers => {
			console.log(park5DayWeathers);
			let park5DW = park5DayWeathers.map((park5DWObj, i) =>
			<ParkWeatherRow mon = {park5DWObj.mon} dt={park5DWObj.dt} minTemp={park5DWObj.minTemp} maxTemp={park5DWObj.maxTemp} aveTemp={park5DWObj.aveTemp}/>
			);
			this.setState({
				park5DayWeathers: park5DW
			})
			

		}, 
		err => {
			console.log(err)
		});



	}
	render() {
		//console.log("Selected park is:")
		//console.log(this.state.selectedPark)
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

			<div className="container">
			  <div className="backgroundClear">
				<div className="h5">Get National Park Information</div>

				  <div className="dropdown-container">
					<select value={this.state.selectedPark} onChange={this.handleChange} className="dropdown" id="parksDropdown">
						<option select value> -- select an option -- </option>
						{this.state.parks}
					</select>
					<button className="submit-btn" id="parkSubmitBtn" onClick={this.submitPark}>Submit</button>
				  </div>
			  </div>

			  <table class="upper">
			  <table class="upper">
				  <tr>
			  <table style ={tStyle} class="upper">
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
				  <section>
				  <h2 style={hStyle}>Yearly Attendance</h2>
				  <div className="infobox" id="parkResults" align="center">
			            	{this.state.parkAttendance}
			          	</div>
						  </section>
				</td>
				</tr>

				<tr><td colspan="3">
					<section className="backgroundGray">

						<table>
							<tr>
								<td>
									<div className="header"><strong>Reviews</strong></div>
								</td>
								
								</tr>
							{this.state.parkReviews}
						</table>

					</section>
					</td></tr>

					<tr><td colspan="3">
					<section className="backgroundGray">
					<div>5 Day Historical Weather Forcast</div>						
					<table>
						<tr>
    						<td>
       						<div className="header"><strong>Date</strong></div>
   							</td>
    						<td>
        						<div className="header"><strong>Min Temp</strong></div>
 						    </td>
    						<td>
        						<div className="header"><strong>Ave Temp</strong></div>
    						</td>
    						<td>
        						<div className="header"><strong>Max Temp</strong></div>
    						</td>
    
    						</tr>
						{this.state.park5DayWeathers}
						</table>
						</section>
						</td></tr>
			  </table>

			</div>
		</div>
		);
	}
}


{/* <section>

<div className="backgroundGray">
	<div className="">
	  <div className="park">
		<div className="header"><strong>Reviews</strong></div>
	  </div>
	  <div className="parks-container" id="parkReviews">
		{this.state.parkReviews}
	  </div>
	</div>
  </div>			  

</section> */}
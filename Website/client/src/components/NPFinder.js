import React from 'react';
import PageNavbar from './PageNavbar';
import ParkDetailRow from './ParkDetailRow';
import ParkInfoBox from './ParkInfoBox';
import ParkSummary from './ParkSummary'
import '../style/NPFinder.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class NPFinder extends React.Component {
	constructor(props) {
		super(props);
		const queryString= window.location.search
		let urlParams = new URLSearchParams(queryString)

		this.state = {
			selectedPark: urlParams.get('park'),
			parks: [],
			parkDetail: []
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

		this.submitPark()
	}

	handleChange(e) {
		this.setState({
			selectedPark: e.target.value
		});
	}

	/* ---- Q3b (Best Genres) ---- */
	submitPark() {
		
		let parkInput = this.state.selectedPark;
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
			<ParkInfoBox imageUrl={imageObj.image1loc} credit={imageObj.image1credit} name = {imageObj.name} phone={imageObj.phoneNumber} rating={imageObj.rating} location={imageObj.address} lat={imageObj.lat} lng={imageObj.lng} website={imageObj.websiteUrl}/>
			);
			//update the state to have the park image
			this.setState({
				parkPhoto: parkImg
			})

		}, 
		err => {
			console.log(err)
		});


		//Fetch the park detail information and photo and save it to park photo
		fetch("http://localhost:8081/nearbyParks/" + parkInput,
		{
			method: "GET"
		}).then(res => {
			return res.json();
		}, err => {
			console.log(err);
		}).then(nearbyParks => {
			console.log(nearbyParks);
			//save the image and park details to a park info box object
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




	}
	render() {
		let hStyle = {
			"text-align": 'center',
			"text-transform": 'uppercase',
		};

		return (
			<div className="NPFinder">
			<PageNavbar active="Finder" />

			<div className="container np-container">
			  <div className="jumbotron1">
				<div className="h5">Get National Park Information</div>

				<div className="years-container">
				  <div className="dropdown-container">
					<select value={this.state.selectedPark} onChange={this.handleChange} className="dropdown" id="parksDropdown">
						<option select value> -- select an option -- </option>
						{this.state.parks}
					</select>
					<button className="submit-btn" id="decadesSubmitBtn" onClick={this.submitPark}>Submit</button>
				  </div>
				</div>
			  </div>
			  		<section>
				  <div className="jumbotron2">
				  <h2 style={hStyle}>Selected Park</h2>
				  		<div className="infobox" id="parkResults" align="right">
			            	{this.state.parkPhoto}
			          	</div>
				  </div>
				  </section>
					<section>
					
				  <div className="jumbotron2">
				  		<h2 style={hStyle}>NEARBY PARKS</h2>
				  		<div className="infobox" id="parkResults" align="left">
			            	{this.state.nearbyParks}
			          	</div>
				  </div>    
				  </section> 
				
			  
			</div>
		</div>
		);
	}
}

/*
<div className="jumbotron2">
				<div className="parks-container">
				  <div className="park">
					<div className="header"><strong>Park</strong></div>
					<div className="header"><strong>Address</strong></div>
					<div className="header"><strong>Phone Number</strong></div>
					<div className="header"><strong>Rating</strong></div>
				  </div>
				  <div className="parks-container" id="parkResults">
					{this.state.parkDetail}
				  </div>
				</div>
			  </div>
			  */
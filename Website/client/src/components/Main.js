import React from 'react';
import PageNavbar from './PageNavbar';
import '../style/Main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainPopularParksRow from './MainPopularParksRow';

export default class Main extends React.Component {
	constructor(props) {
		super(props);
		const queryString= window.location.search
		let urlParams = new URLSearchParams(queryString)

		this.state = {
			selectedPark: urlParams.get('park'),
			imageLink: '/public/bg.jpg',
			parks: [],
			parkDetail: [],
			popularParks: [],
			park5DayWeathers: [],
			regions: [],
			selectedRegion: "",
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
			selectedRegion: e.target.value
		});
	}

	submitPark() {
		console.log("Submitted the Region")
		console.log(this.state.selectedRegion)
		console.log(typeof(this.state.selectedRegion))
		let regionInput = this.state.selectedRegion;
		console.log("selectedRegion/value is:  ")
		console.log(this.state.selectedRegion)
		if (regionInput == "true" || regionInput == null) {
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


				//Fetch the Popular Parks in Region
				fetch("http://localhost:8081/popularParksInRegion/" + regionInput,
				{
					method: "GET"
				}).then(res => {
					return res.json();
				}, err => {
					console.log(err);
				}).then(popularParks => {
					console.log(popularParks);
					//save the image and park details to a park info box object
					let popularPark = popularParks.map((parkRevObj, i) =>
					<MainPopularParksRow Park = {parkRevObj.Park} Visitors={parkRevObj.Visitors} />
					);
					//update the state to have the park image
					this.setState({
						popularParks: popularPark
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
			
			<div className="Main" style={{ 	backgroundImage: `url(${this.state.imageLink})`, backgroundSize: 'cover'}}>
			<PageNavbar active="Main" />

			<div className="mainContainer" > 
			{/* <table className="mainTable" >
			
				<tr>
					<td>An adventure awaits exploring the US National Parks!  Before you hit the road though, let us help you pick the best stops based on region, weather, reviews and attendance.  <br/>
					<br/> Use Finder tab to explore each individual park. <br/>
					<br/> Recommendations will provide you some insight into things to consider when you select your final destination. <br/>
					<br/> Wherever your adventure leaves you wandering, enjoy and keep safe!</td> 
					<td><div className="dropdown-container">
					<select value={this.state.selectedRegion} onChange={this.handleChange} className="dropdown" id="parksDropdown">
						<option select value> -- select a US Region -- </option>
						<option value="1"> Pacific Region </option>
						<option value="2"> Rocky Mountain Region </option>
						<option value="3"> Southwest Region </option>
						<option value="4"> Midwest Region </option>
						<option value="5"> Northeast Region </option>
						<option value="6"> Southeast Region </option>
					</select>
					<button className="submit-btn" id="parkSubmitBtn" onClick={this.submitPark}>Submit</button>
				  </div></td> 
				</tr>
				<tr>
					<td>x</td> 
					<td>y</td> 
				</tr>

			</table> */}

			
				

			<div class = "row">
					<div  class = "column left"><b>An adventure awaits exploring the US National Parks!  Before you hit the road though, let us help you pick the best stops based on region, weather, reviews and attendance.  <br/>
					<br/> Use Finder tab to explore each individual park. <br/>
					<br/> Recommendations will provide you some insight into things to consider when you select your final destination. <br/>
					<br/> Wherever your adventure leaves you wandering, enjoy and keep safe!</b></div>
					<div class = "column right"><div className="dropdown-container">
					<select value={this.state.selectedRegion} onChange={this.handleChange} className="dropdown" id="parksDropdown">
						<option select value> -- select a US Region -- </option>
						<option value="0"> All Parks</option>
						<option value="1"> Pacific Region </option>
						<option value="2"> Rocky Mountain Region </option>
						<option value="3"> Southwest Region </option>
						<option value="4"> Midwest Region </option>
						<option value="5"> Northeast Region </option>
						<option value="6"> Southeast Region </option>
					</select>
					<button className="submit-btn" id="parkSubmitBtn" onClick={this.submitPark}>Submit</button><br/>

					<table style ={tStyle} class="upper" >
						<td class="mp-left">
						<section>
							<h2 style={hStyle}>MOST POPULAR PARKS</h2>
							<div className="infobox" id="parkResults" align="center">
							  {this.state.popularParks}
							</div>
						</section>
						</td>
					</table>

					</div></div> 
				</div>
			
			</div>

					    
			{/* <div className="container np-container">
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

			  <table style ={tStyle} class="upper" >
				<td class="mp-left">
				<section>
					
					
							<h2 style={hStyle}>NEARBY PARKS</h2>
							<div className="infobox" id="parkResults" align="center">
							  {this.state.nearbyParks}
							</div>
					    
					</section>
					<section>
					<td >
					<section className="backgroundBlue" align="center">
					<div><span>&#9788;</span> 5 Day Historical Weather Forcast <span>&#9788;</span></div>						
					<table className="temptable" align="center">
						<tr>
    						<th>
       						<div className="temptableheader"><strong>Date</strong></div>
   							</th>
    						<th>
        						<div className="temptableheader"><strong>Min Temp <span>&#730;</span>F</strong></div>
 						    </th>
    						<th>
        						<div className="temptableheader"><strong>Avg Temp <span>&#730;</span>F</strong></div>
    						</th>
    						<th>
        						<div className="temptableheader"><strong>Max Temp <span>&#730;</span>F</strong></div>
    						</th>
    
    						</tr>
						{this.state.park5DayWeathers}
						</table>
						</section>
						</td>
						<td>
						</td>
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
				  
				  <table className="attendancetable" align="center">
				  <th colspan="3" style={hStyle}>Yearly Attendance</th>
			            	{this.state.parkAttendance}
			          	</table>

						  </section>
						  <section className="backgroundGray">

						<table className="reviewTable">
							<tr>
								<td>
									<div className="header" align="center"><strong>Reviews</strong></div>
								</td>
								
								</tr>
							{this.state.parkReviews}
						</table>

					</section>
				</td>
				<tr vertical-align="top">

						<td colspan="3">
					    
					</td>

						</tr>


			  </table>
			  		
					
				
			  
		</div> */}
		</div>
		);
	}
}

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
			selectedRegion: "0",
			opacity: 0
		};

		this.submitPark = this.submitPark.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		let regionInput = this.state.selectedRegion;
		this.submitPark()
		if (this.state.selectedPark != null) {
			this.submitPark()
		}
	}

	handleChange(e) {
		this.setState({
			selectedRegion: e.target.value
		});
		console.log("handleChange");
		console.log(this.state.selectedRegion);
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
					<MainPopularParksRow Park = {parkRevObj.Park} Visitors={parkRevObj.Visitors} imageUrl={parkRevObj.imageUrl} credit={parkRevObj.credit}/>
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
			<div class = "row">
					<div  class = "column left"><b>An adventure awaits exploring the US National Parks!  Before you hit the road though, let us help you pick the best stops based on region, weather, reviews and attendance.  <br/>
					<br/> Use <a href="/Finder">Finder</a> tab to explore each individual park. <br/>
					<br/> <a href="/Recommendations">Recommendations</a> will provide you some insight into things to consider when you select your final destination. <br/>
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
							<div align="center"><b>Based on Average Annual Visitors </b></div>
							<div align="center"><b>(from 2012-2016) </b></div>
							<br/> 
							<div className="infobox" id="parkResults" align="center">
							  {this.state.popularParks}
							</div>
						</section>
						</td>
					</table>

					</div></div> 
				</div>
			</div>
		</div>
		);
	}
}

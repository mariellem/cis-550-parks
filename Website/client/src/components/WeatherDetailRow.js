import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class WeatherDetailRow extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			
			<div className="weatherResults">
				<div className="name">{this.props.name} ({this.props.state})</div>
				<div className="high">HIGH: {Math.round(this.props.high)} degrees F</div>
				<div className="low">LOW: {Math.round(this.props.low)} degrees F </div>
				<div className="average">AVERAGE: {Math.round(this.props.average)} degrees F</div>
				<div className="sunHours">{Math.round(this.props.sunHours)} hours of sun expected</div>
 				<div className="snowfall">{Math.round(this.props.snowfall)} inches of snow expected </div>
				<div className="uvIndex">UV INDEX: {Math.round(this.props.uvIndex)} </div>
				<br></br>
			</div>
		);
	}
}

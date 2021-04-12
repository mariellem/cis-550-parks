import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class WeatherDetailRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="weatherResults">
				<div className="name">{this.props.name}</div>
				<div className="lat">{this.props.lat}</div>
				<div className="lng">{this.props.lng}</div>
				<div className="state">{this.props.state}</div>
				<div className="high">{this.props.high}</div>
				<div className="low">{this.props.low}</div>
				<div className="average">{this.props.average}</div>
				<div className="sunHours">{this.props.sunHours}</div>
				<div className="snowfall">{this.props.snowfall}</div>
				<div className="uvIndex">{this.props.uvIndex}</div>
				<div className="month">{this.props.month}</div>
			</div>
		);
	}
}

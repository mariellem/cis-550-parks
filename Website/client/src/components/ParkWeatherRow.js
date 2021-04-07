import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ParkWeatherRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<tr>
				<td>
				  <div className="park5dayWeather">{this.props.mon}/{this.props.dt}</div>
				</td>
				<td>
				  <div className="park5dayWeather">{this.props.minTemp}</div>
				</td>
				<td>
				  <div className="park5dayWeather">{this.props.maxTemp}</div>
				</td>
				<td>
				  <div className="park5dayWeather">{this.props.aveTemp}</div>
				</td>
			</tr>
		);
	}
}
 
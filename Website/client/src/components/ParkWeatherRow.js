import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ParkWeatherRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<tr align="center">
				<td>
				  <div className="park5dayWeather">{this.props.mon}/{this.props.dt}</div>
				</td>
				<td>
				  <div className="park5dayWeather">{Math.round(this.props.minTemp)}</div>
				</td>
				<td>
				  <div className="park5dayWeather">{Math.round(this.props.maxTemp)}</div>
				</td>
				<td>
				  <div className="park5dayWeather">{Math.round(this.props.aveTemp)}</div>
				</td>
			</tr>
		);
	}
}
 
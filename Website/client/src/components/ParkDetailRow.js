import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ParkDetailRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="parkResults">
				<div className="name">{this.props.name}</div>
				<div className="address">{this.props.address}</div>
				<div className="phoneNumber">{this.props.phoneNumber}</div>
				<div className="rating">{this.props.rating}</div>
			</div>
		);
	}
}

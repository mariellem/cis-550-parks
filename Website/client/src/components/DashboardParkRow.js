import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

export default class DashboardParkRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="movie">
				<div className="title">{this.props.placeId}</div>
				<div className="rating">{this.props.name}</div>
				<div className="votes">{this.props.state}</div>
			</div>
		);
	}
}

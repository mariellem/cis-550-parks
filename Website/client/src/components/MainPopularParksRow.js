import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

export default class MainPopularParksRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="movie">
				<div className="name">{this.props.name}</div>
				<div className="visitors">{this.props.visitors}</div>
			</div>
		);
	}
}

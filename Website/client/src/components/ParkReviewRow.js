import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ParkReviewRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<tr>
				<div className="rating">{this.props.rating}:{this.props.review}</div>
			</tr>
		);
	}
}
 
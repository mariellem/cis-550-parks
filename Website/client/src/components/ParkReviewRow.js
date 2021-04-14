import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ParkReviewRow extends React.Component {
	constructor(props) {
		super(props);
	}


	render() {

		if(this.props.rating >= 5){
			return (
				<tr>
					<div className="rating"><div><span>&#9733;&#9733;&#9733;&#9733;&#9733;</span></div>{this.props.review}</div>
				</tr>
			);
		}
		else if(this.props.rating == 4){
			return (
				<tr>
					<div className="rating"><div><span>&#9733;&#9733;&#9733;&#9733;</span></div>{this.props.review}</div>
				</tr>
			);
		}
		else if(this.props.rating == 3){
			return (
				<tr>
					<div className="rating"><div><span>&#9733;&#9733;&#9733;</span></div>{this.props.review}</div>
				</tr>
			);
		}
		else if(this.props.rating == 2){
			return (
				<tr>
					<div className="rating"><div><span>&#9733;&#9733;</span></div>{this.props.review}</div>
				</tr>
			);
		}
		else if(this.props.rating == 1){
			return (
				<tr>
					<div className="rating"><div><span>&#9733;</span></div>{this.props.review}</div>
				</tr>
			);
		}
		else {
			return (
				<tr>
					<div className="rating">{this.props.rating}:{this.props.review}</div>
				</tr>
			);
		}
	}
}
 

// return (
// 	<tr>
// 		<div className="rating">{this.props.rating}:{this.props.review}</div>
// 	</tr>
// );

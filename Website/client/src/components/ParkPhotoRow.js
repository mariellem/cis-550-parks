import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ParkPhotoRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
            
			<div className="parkPhoto">
                <div className="parkName">{this.props.name} <br/></div>
                <img src={this.props.imageUrl} alt={this.props.credit}></img>
			</div>
		);
	}
}

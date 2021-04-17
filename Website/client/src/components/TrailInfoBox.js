import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class TrailInfoBox extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			
        <tr>
                    <td>
                        <div>{this.props.name}</div>
                    </td>
                    <td>
                        <div>{this.props.distance}</div>
                    </td>
                    
                    <td >
                        <div>{this.props.rating}</div>
                    </td>
                </tr>           
		);
	}
}

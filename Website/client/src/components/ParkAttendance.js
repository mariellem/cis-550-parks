import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ParkAttendance extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
            <table class="infobox">
            <tbody>
                
                <tr>
                    <th class="mp-left">
                        <div>{this.props.year}</div>
                    </th>
                    <td class="mp-right">
                        <div>{this.props.visitors}</div>
                    </td>
                </tr>
    
                
                    
                </tbody>
                </table>
		);
	}
}

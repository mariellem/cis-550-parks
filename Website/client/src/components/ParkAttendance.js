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
               
                <td>
                    <div className="parkName" align="center"><b></b> </div>
                    </td>
                
                </tr>
                
                <tr>
                    <th>
                        <div>{this.props.year}</div>
                    </th>
                    <td>
                        <div>{this.props.visitors}</div>
                    </td>
                </tr>
    
                
                    
                </tbody>
                </table>
		);
	}
}

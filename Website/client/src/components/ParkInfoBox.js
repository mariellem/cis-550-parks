import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ParkInfoBox extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
        <table class="infobox">
        <tbody>
			
            <tr>
           
            <td>
                <div className="parkName" align="center"><b>{this.props.name}</b> </div>
                </td>
            
            </tr>
            
            <tr>
           
            <td>
            <img src={this.props.imageUrl} alt={this.props.credit}></img>
            </td>
            </tr>
            <tr>
                <th>
                    <div>Location</div>
                </th>
                <td>
                    <div>{this.props.location}</div>
                </td>
            </tr>

            <tr>
                <th>
                    <div>Latitude</div>
                </th>
                <td>
                    <div>{this.props.lat}</div>
                </td>
            </tr> 

            <tr>
                <th>
                    <div>Longitude</div>
                </th>
                <td>
                    <div>{this.props.lng}</div>
                </td>
            </tr> 

            <tr>
                <th>
                    <div>Rating</div>
                </th>
                <td>
                    <div>{this.props.rating}</div>
                </td>
            </tr>   

            <tr>
                <th>
                    <div>Website</div>
                </th>
                <td>
                    <div><a href={this.props.website} target="blank">{this.props.name}</a></div>
                    
                </td>
            </tr>  
                
            </tbody>
            </table>
		);
	}
}

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
              <td colspan="2">
              <div class="infobox-title">{this.props.name}</div>
              </td>
          </tr>
            
            <tr>
           
            <td colspan="2">
            
            <img class="center" src={this.props.imageUrl} alt={this.props.credit} height="100" width="120"></img>
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

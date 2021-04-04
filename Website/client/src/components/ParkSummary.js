import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ParkPhotoRow extends React.Component {
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
                    <div><b>Distance</b></div>
                </th>
                <td>
                    <div>{this.props.rating} miles</div>
                </td>
            </tr>  


            <tr>
                <th>
                    <div><b>Rating</b></div>
                </th>
                <td>
                    <div>{this.props.rating}</div>
                </td>
            </tr>   

          
                
            </tbody>
            </table>
        
		);
	}
}
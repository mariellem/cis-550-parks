import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

export default class ParkPhotoRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
      
        let redirect = "?park="+this.props.name
       
		return (
            <table class="infobox">
        <tbody>
			
            <tr>
           
            <td>
                
                <div className="parkName" align="center"><b><a href={redirect} target="blank">{this.props.name}</a></b> </div>
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
                    <div>{Math.round(this.props.distance)} miles</div>
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
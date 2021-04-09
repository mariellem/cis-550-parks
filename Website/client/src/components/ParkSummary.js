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
           
            <td colspan="2">
                
                <div align="center"><b><a href={redirect} target="blank">{this.props.name}</a></b> </div>
                </td>
            
            </tr>
            
            <tr>
           
            <td colspan="2">
            <img class="center" src={this.props.imageUrl} alt={this.props.credit} width="100px" height="120px"></img>
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
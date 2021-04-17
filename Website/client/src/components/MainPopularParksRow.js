import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

export default class MainPopularParksRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let redirect = "\Finder\?park="+this.props.Park
		return (
			<table class="infobox">
			<tbody>
				
			 	<tr>
			   
				<td colspan="2">
					<div align="center"><b><a href={redirect} target="blank">{this.props.Park}</a></b> </div>
		
			 	</td>
				</tr>
				
				<tr>
			   
				{/* <td colspan="2">
				<img class="center" src={this.props.imageUrl} alt={this.props.credit} width="100px" height="120px"></img>
				</td>  */}
				</tr> 
	
				<tr>
				<td>
						<div align="center"><b>Average Visitors </b></div>
						<div align="center"><b>(per year 2012-2016) </b></div>
						<div align="center">{Math.round(this.props.Visitors)} </div>
						
				</td>
				</tr>  
		
				</tbody>
				</table>
			
		 );
	}
}

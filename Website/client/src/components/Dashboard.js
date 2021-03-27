import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import DashboardParkRow from './DashboardParkRow';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of genres,
    // and a list of movies for a specified genre.
    this.state = {
      genres: [],
      movies: [],
      parks: []
    }
  }

  // React function that is called when the page load.
  componentDidMount() {
    // Send an HTTP request to the server.
    fetch("http://localhost:8081/places",
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();
    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(parkList => {
      if (!parkList) return;
      // Map each genreObj in genreList to an HTML element:
      // A button which triggers the showMovies function for each genre.
      let parksDivs = parkList.map((parkObj, i) =>
      <DashboardParkRow placeId={parkObj.placeId} name={parkObj.name} state={parkObj.State}/>
      );
      // Set the state of the genres list to the value returned by the HTTP response from the server.
      this.setState({
        parks: parksDivs
      });
    }, err => {
      // Print the error if there is one.
      console.log(err);
    });
  }


  render() {    
    return (
      <div className="Dashboard">

        <PageNavbar active="dashboard" />

        <br></br>
        <div className="container movies-container">
          <br></br>
          <div className="jumbotron">
            <div className="movies-container">
              <div className="movies-header">
                <div className="header-lg"><strong>Id</strong></div>
                <div className="header"><strong>Name</strong></div>
                <div className="header"><strong>State</strong></div>
              </div>
              <div className="results-container" id="results">
                {this.state.parks}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
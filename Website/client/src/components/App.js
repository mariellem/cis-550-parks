import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Main from './Main';
import NPFinder from './NPFinder';
import Recommendations from './ParkRecommendations';

export default class App extends React.Component {

	

	render() {
		let defaultPark = ""
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => (
								<Main />
							)}
						/>
						<Route
							exact
							path="/Main"
							render={() => (
								<Main />
							)}
						/>
						<Route
							path="/Finder"
							render={() => (
								<NPFinder selectedPark = {defaultPark} />
							)}
						/>
						<Route
							path="/Recommendations"
							render={() => (
								<Recommendations />
						)}
					/>
					</Switch>
				</Router>
			</div>
		);
	}
}
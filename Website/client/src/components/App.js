import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Dashboard from './Dashboard';
import NPFinder from './NPFinder';

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
								<Dashboard />
							)}
						/>
						<Route
							exact
							path="/dashboard"
							render={() => (
								<Dashboard />
							)}
						/>
						<Route
							path="/Finder"
							render={() => (
								<NPFinder selectedPark = {defaultPark} />
							)}
						/>
					</Switch>
				</Router>
			</div>
		);
	}
}
import React from 'react';
import SideNav from './SideNav';
import NavBar from './NavBar';
import MainContent from './MainContent';
import '../CSS/FirstSite.scss';

class FirstSite extends React.Component {
	constructor() {
		super();

		this.changeUser = this.changeUser.bind(this);

		this.state = {
			name: "",
			lastName: ""
		};
	}

	changeUser(n, l) {
		this.setState({ name: n, lastName: l })
	}

	render() {
		return (
			<div className='FirstSite'>
				<NavBar name={this.state.name} lastName={this.state.lastName} />
				<div className='underNav'>
					<SideNav />
					<MainContent changeUser={this.changeUser} />
				</div>
			</div>
		);
	}
}

export default FirstSite;

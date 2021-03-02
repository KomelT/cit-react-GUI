import React from 'react';
import '../CSS/NavBar.scss';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class NavBar extends React.Component {
	constructor(props) {
		super(props);

		this.optionsShow = this.optionsShow.bind(this);
		this.changeUser = this.changeUser.bind(this);

		this.state = {
			style: 'none',
			name: this.props.name,
			lastName: this.props.lastName
		};
	}

	logOut() {
		cookies.remove('token_id');
		window.location.reload(false);
	}

	optionsShow() {
		if (this.state.style === 'none') this.setState({ style: 'flex' });
		else this.setState({ style: 'none' });
	}

	changeUser(n, l) {
		this.setState({ name: n, lastName: l })
	}

	render() {
		return (
			<div className='NavBar'>
				<h1 className='logo'>PKP Namizje</h1>
				<span className='userInfo'>
					<i className='fas fa-user'></i>
					<p>{this.props.name + " " + this.props.lastName}</p>
					<i onClick={this.optionsShow} className='fas fa-sort-down'></i>
				</span>
				<div style={{ display: this.state.style }} className='options'>
					<span className='option'>
						<i className='fas fa-user-cog'></i>
						Osebne nastavitve
					</span>
					<span className='option' onClick={this.logOut}>
						<i className='fas fa-power-off'></i>
						Odjava
					</span>
					<span className='option'>
						<i className='fas fa-question-circle'></i>
						Pomoč uporabnikom
					</span>
				</div>
			</div>
		);
	}
}

export default NavBar;

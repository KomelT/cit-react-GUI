import React from 'react';
import '../CSS/SideNav.scss';

class SideBar extends React.Component {
	constructor(props) {
		super();
	}

	render() {
		return (
			<div className='SideBar'>
				<hr></hr>
				<p className='heading'>NASTAVITVE</p>
				<p className='choice'>
					<i className='fas fa-user-circle'></i>
					Uporabniki
				</p>
				<hr id='last'></hr>
				<p className='heading'>PREGLED</p>
				<p className='choice'>
					<i className='fas fa-business-time'></i>
					Prihodi in odhodi
				</p>
				<p className='choice'>
					<i className='fas fa-mug-hot'></i>
					Dopust
				</p>
			</div>
		);
	}
}

export default SideBar;

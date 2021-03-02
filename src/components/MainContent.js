import React from 'react';
import '../CSS/MainContent.scss';
import SmallCalendar from './SmallCalendar';
import Cookies from 'universal-cookie';
const cookies = new Cookies();


class Maincontent extends React.Component {
	constructor(props) {
		super(props);
		this.setDate = this.setDate.bind(this);
		this.fetchMainContent = this.fetchMainContent.bind(this);
		this.state = {
			weekDay: this.setDate(),
			hours: '',
			minutes: '',
			seconds: '',
			name: "",
			lastName: "",
			prisotni: 0,
			t_odsotni: 0,
			d_odsotni: 0,
			vsi: 0,
			dates: [null, null, null, null, null, null, null],
			vacation: [null, null],
			vacation_data: []
		};

		setInterval(() => {
			this.fetchMainContent();
		}, 5000)
	}

	setDate() {
		var dneviVTednu = ['nedelja', 'ponedeljek', 'torek', 'sreda', 'četrtek', 'petek', 'sobota'];
		return dneviVTednu[new Date().getDay()];
	}

	setTime() {
		var currentdate = new Date();
		var hours = currentdate.getHours();

		// correct for number over 24, and negatives
		if (hours >= 24) {
			hours -= 24;
		}
		if (hours < 0) {
			hours += 12;
		}

		// add leading zero, first convert hours to string
		hours = hours + '';
		if (hours.length === 1) {
			hours = '0' + hours;
		}

		// minutes are the same on every time zone
		var minutes = currentdate.getUTCMinutes();

		// add leading zero, first convert hours to string
		minutes = minutes + '';
		if (minutes.length === 1) {
			minutes = '0' + minutes;
		}

		let seconds = currentdate.getUTCSeconds();
		this.setState({
			hours: hours,
			minutes: minutes,
			seconds: seconds,
		});
	}
	componentWillMount() {
		this.setTime();
	}
	componentDidMount() {
		this.fetchMainContent();
		window.setInterval(
			function () {
				this.setTime();
			}.bind(this),
			1000
		);
	}

	fetchMainContent() {
		const fetchSetting = {
			method: 'POST',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/json' },
			redirect: 'follow',
			referrerPolicy: 'no-referrer',
			body: JSON.stringify({
				api_passwd: process.env.REACT_APP_API_PASSWD,
				api_name: process.env.REACT_APP_API_NAME,
				token_id: cookies.get("token_id")
			}),
		};


		fetch(process.env.REACT_APP_API_URL + '/mainContent', fetchSetting)
			.then((resposne) => {
				if (resposne.status === 404) {
					let err = new Error(resposne.status + "," + resposne.statusText)
					throw err
				}
				resposne.json().then((data) => {
					if (data.code === 200) {
						this.setState({ prisotni: data.workers[0], t_odsotni: data.workers[1], d_odsotni: data.workers[2], vsi: data.workers[3], dates: data.dates, name: data.name, lastName: data.lastName, vacation: [data.vacation[0], data.vacation[1]], vacation_data: data.vacation[2] })
						this.props.changeUser(data.name, data.lastName)

					} else {
						this.setState({ isLoading: false, isLogged: false, errMessage: data.message });
					}
				});
			})
			.catch((e) => {
				console.log("Calling /mainContent failed with ERROR")
				this.setState({
					isLoading: false,
					isLogged: false,
					errMessage: 'Prišlo je do napake pri povezovanju s strežnikom!',
				});
			});
	}

	render() {
		return (
			<div className='MainContent'>
				<div className='content'>
					<p className='path'>/ Doma</p>
					<p className='welcome'>Živijo {this.state.name}</p>
					<p className='date'>
						Danes je {this.state.weekDay},{' '}
						<span className='bold'>{new Date().toLocaleDateString()}</span>
					</p>
					<p className='hour'>
						Ura je{' '}
						<span className='bold'>
							{this.state.hours}:{this.state.minutes}:{this.state.seconds}
						</span>
					</p>
					<div className='workersCurrently'>
						<div className='wcNodes'>
							<div style={{ background: '#4CCC59' }} className='wcNode'>
								<p className='wcNumber'>{this.state.prisotni}</p>
								<p className='wcText'>Danes prisotni</p>
							</div>
							<div className='wcNode' style={{ background: '#E74A3B' }}>
								<p className='wcNumber'>{this.state.t_odsotni}</p>
								<p className='wcText'>Trenutno odsotni</p>
							</div>
							<div className='wcNode' style={{ background: '#E78E3B' }}>
								<p className='wcNumber'>{this.state.d_odsotni}</p>
								<p className='wcText'>Danes odsotni</p>
							</div>
							<div className='wcNode' style={{ background: '#36B9CC' }}>
								<p className='wcNumber'>{this.state.vsi}</p>
								<p className='wcText'>Vsi uporabniki v sistemu</p>
							</div>
						</div>
						<p className='wcTextUpdate'>Podatki so bili nazadnje osveženi 11:58:23</p>
						<p className='wcTextUpdate2'>
							<i className='fas fa-sync-alt'></i> Ponovno osveži podatke
						</p>
					</div>
					<p className="smallcalendarHeading">Pregled delavnih ur za tekoč teden:</p>
					<div className='mcSmallCallendar'>
						<SmallCalendar date={this.state.dates[0]} hours='8' />
						<SmallCalendar date={this.state.dates[1]} hours='8.5' />
						<SmallCalendar date={this.state.dates[2]} hours='7.3' />
						<SmallCalendar date={this.state.dates[3]} hours='6' />
						<SmallCalendar date={this.state.dates[4]} hours='9' />
						<SmallCalendar date={this.state.dates[5]} hours='8.2' />
						<SmallCalendar date={this.state.dates[6]} hours='' />
					</div>

					<p className="dopustHeading">Pregled št. dni dopusta za to leto:</p>
					<div className="dContiner">
						<span className="dHeadings">Neizkoriščeni dnevi: <p className="dGreen">{this.state.vacation[0]}</p></span>
						<span className="dHeadings">Izkoriščeni dnevi: <p className="dRed">{this.state.vacation[1]}</p></span>

						<div className="dWhenContainer">
							{this.state.vacation_data.map((data, i) => {
								if (data[0] !== null)
									return (
										<p className="dwTime">{data[0]}: <p className="dRed">{data[1]}</p></p>
									)

							})}
						</div>

					</div>

				</div>
			</div >
		);
	}
}

class Vacation extends React.Component {
	constructor(props) {
		super(props)
	}
	render() {
		return <h1>hEJ</h1>
	}
}

export default Maincontent;

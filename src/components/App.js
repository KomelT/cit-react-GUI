import React from 'react';
import '../CSS/App.scss';
import LogIn from './LogIn';
import FirstSite from './FirstSite';
//import { isMobile } from 'react-device-detect';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class App extends React.Component {
	constructor() {
		super();

		this.isLogged = this.isLogged.bind(this);
		this.logMeIn = this.logMeIn.bind(this);
		this.handleWindowClose = this.handleWindowClose.bind(this);

		this.state = {
			isLoading: true,
			isLogged: false,
			style: 'flex',
			errMessage: '',
		};
		this.isLogged();
	}

	doSomethingBeforeUnload = () => {
		if (cookies.get("clear") == "true") {
			cookies.remove("token_id")
		}
	}

	// Setup the `beforeunload` event listener
	setupBeforeUnloadListener = () => {
		window.addEventListener("beforeunload", (ev) => {
			ev.preventDefault();
			return this.doSomethingBeforeUnload();
		});
	};

	componentDidMount() {
		// Activate the event listener
		this.setupBeforeUnloadListener();
	}

	async isLogged() {
		this.setState({ isLoading: true });
		let token = await cookies.get('token_id');
		if (token === undefined) {
			this.setState({ isLoading: false, isLogged: false });
			return;
		}
		const fetchSetting = {
			method: 'POST',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/json' },
			redirect: 'follow',
			referrerPolicy: 'no-referrer',
			body: JSON.stringify({
				api_passwd: 'h3Rq@*SMA@5QmgAR37n3xr#*^dr1IW4^',
				api_name: 'react-gui',
				token_id: token,
			}),
		};

		fetch(process.env.REACT_APP_API_URL + '/logIn/validate', fetchSetting)
			.then((response) => {
				if (response.status === 500) {
					this.setState({
						errMessage: 'Prišlo je do napake, pri vzpostavljanju povezave s strežnikom!',
						isLogged: false,
						isLoading: false,
					});
					return;
				} else {
					response.json().then((data) => {
						if (data.code === 200) {
							let validation = data.validation === true ? true : false;

							if (validation) this.setState({ isLoading: false, isLogged: true });
							else this.setState({ isLoading: false, isLogged: false });
						}
					});
				}
			})
			.catch(
				this.setState({
					errMessage: 'Prišlo je do napake, pri vzpostavljanju povezave s strežnikom!',
					isLogged: false,
					isLoading: false,
				})
			);
		/*
		setTimeout(() => {
			this.setState({ isLogged: false, isLoading: false });
		}, 1000);
		*/
	}

	logMeIn(e, p, stayLogged) {
		this.setState({ isLoading: true });
		let email = e;
		let password = p;

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
				email: email,
				password: password,
			}),
		};

		fetch(process.env.REACT_APP_API_URL + '/logIn', fetchSetting)
			.then((resposne) => {
				if (resposne.status === 404) {
					let err = new Error(resposne.status + "," + resposne.statusText)
					throw err
				}
				resposne.json().then((data) => {
					if (data.code === 200) {
						if (stayLogged) {
							var today = new Date();
							today.setHours(today.getHours() + 1);
							cookies.set('token_id', data.token_id, { path: '/', expires: today });
							cookies.set("clear", false);
						} else {
							var today = new Date();
							today.setHours(today.getHours() + 1);
							cookies.set('token_id', data.token_id, { path: '/', expires: today });
							cookies.set("clear", true);
						}
						this.setState({ isLoading: false, isLogged: true, errMessage: '' });
					} else {
						this.setState({ isLoading: false, isLogged: false, errMessage: data.message });
					}
				});
			})
			.catch(() => {
				this.setState({
					isLoading: false,
					isLogged: false,
					errMessage: 'Prišlo je do napake pri povezovanju s strežnikom!',
				});
			});
	}

	render() {
		if (this.state.isLoading) {
			return (
				<div className='App'>
					<div
						className='loader-wrapper'
						style={{ display: this.state.isLogged ? 'none' : 'flex' }}
					>
						<span className='loader'>
							<span className='loader-inner'></span>
						</span>
					</div>
				</div>
			);
		} else {
			if (this.state.isLogged) {
				return (
					<div className='App'>
						<FirstSite />
					</div>
				);
			} else {
				return (
					<div className='App'>
						<LogIn logMeIn={this.logMeIn} errMessage={this.state.errMessage} />
					</div>
				);
			}
		}
	}

	handleWindowClose() {
		alert("Alerted Browser Close");
	}
}

export default App;

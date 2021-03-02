import React from 'react';
import '../CSS/bootstrap-scss/bootstrap.scss';
import '../CSS/LogIn.scss';

class LogIn extends React.Component {
	constructor(props) {
		super(props);

		this.checkboxHandler = this.checkboxHandler.bind(this);
		this.submitHandler = this.submitHandler.bind(this);
		this.state = {
			errDisplay: '',
			errMessage: this.props.errMessage,
			email: '',
			password: '',
			checkbox: false,
		};

		this.state.errDisplay = this.state.errMessage === '' ? 'none' : 'block';
	}

	handleChange(event) {
		event.preventDefault();
		this.setState({ [event.target.name]: [event.target.value] });
	}

	checkboxHandler() {
		if (this.state.checkbox) this.setState({ checkbox: false });
		else this.setState({ checkbox: true });
	}

	submitHandler(event) {
		event.preventDefault();
		let email = this.state.email;
		let password = this.state.password;
		let checkbox = this.state.checkbox;

		if (email.length === 0 || password.length === 0) {
			this.setState({
				errMessage: 'Všišite email in geslo!',
				errDisplay: 'flex',
			});
		} else this.props.logMeIn(email, password, checkbox);
	}

	render() {
		return (
			<div className='LogIn'>
				<div className='main'>
					<div className='LogInHeading'></div>
					<form className='form' onSubmit={this.submitHandler}>
						<div className='form-group'>
							<label className='form-check-label'>Email naslov</label>
							<input
								type='email'
								className='form-control'
								aria-describedby='emailHelp'
								placeholder='Vpiši email'
								onChange={this.handleChange.bind(this)}
								name='email'
							/>
						</div>
						<div className='form-group'>
							<label className='form-check-label'>Geslo</label>
							<input
								type='password'
								className='form-control'
								placeholder='Vpiši geslo'
								onChange={this.handleChange.bind(this)}
								name='password'
							/>
						</div>
						<div className='form-group form-check'>
							<input type='checkbox' className='form-check-input' onChange={this.checkboxHandler} />
							<label className='form-check-label'>Zapomni si me</label>
						</div>
						<button type='submit' className='btn btn-primary'>
							Vstopi
						</button>

						<div
							style={{ display: this.state.errDisplay }}
							className='alert alert-danger'
							role='alert'
						>
							{this.state.errMessage}
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default LogIn;

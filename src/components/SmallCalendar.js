import React from 'react';
import '../CSS/SmallCalendar.scss';

class SmallCalendar extends React.Component {
	constructor(props) {
		super(props);

		this.setData = this.setData.bind(this);

		this.state = {
			date: "",
			dayName: '',
			dayDate: '',
			isLoading: true,
			isHoliday: false,
			isWeekend: false,
			isBusinessday: true,
			holiday_name: '',
			dayHour: 0,
			dayHourExcess: 0,
			arrowDeg: '',
			arrowColor: '',
			errMessage: '',
		};

		setInterval(() => {
			if (this.props.date === null) {
			}
			else {
				if (this.state.isLoading) {
					this.setData();
					this.forceUpdate()
				}

			}
		}, 1000)

	}

	async setData() {
		var dneviVTednu = ['Nedelja', 'Ponedeljek', 'Torek', 'Sreda', 'Četrtek', 'Petek', 'Sobota'];
		this.setState({ date: new Date(this.props.date) })
		let date = new Date(this.state.date)
		this.setState({ dayName: dneviVTednu[date.getDay()], dayDate: date.getDate() });

		let dateString = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();

		let hour = this.props.hours;
		let excessHour = Math.round((hour - 8) * 10) / 10;
		let color = '';
		let deg = '';

		if (excessHour >= 0) {
			color = '#4CCC59';
			deg = '0deg';
		} else {
			color = '#E74A3B';
			deg = '180deg';
		}
		this.setState({ dayHour: hour, dayHourExcess: excessHour, arrowColor: color, arrowDeg: deg });

		const fetchSetting = {
			method: 'POST',
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'same-origin',
			headers: { 'Content-Type': 'application/json' },
			redirect: 'follow',
			referrerPolicy: 'no-referrer',
			body: JSON.stringify({
				date: dateString,
			}),
		};

		fetch(process.env.REACT_APP_API_URL + '/holiday', fetchSetting)
			.then((resposne) => {
				resposne
					.json()
					.then((data) => {
						if (resposne.status === 200) {
							this.setState(
								{
									isLoading: false,
									isHoliday: data.holiday,
									holiday_name: data.holiday_name,
									isWeekend: data.weekend,
									errMessage: '',
									isBusinessday: data.businessday,
								},
							);
						}
					})
					.catch(() => {
						this.setState({ isLoading: false, errMessage: 'Prišlo je do napake!' });
					});
			})
			.catch(() => {
				this.setState({ isLoading: false, errMessage: 'Prišlo je do napake!' });
			});
	}

	render() {
		if (!this.state.isLoading) {
			if (!this.state.errMessage) {
				return (
					<div className='SmallCalendar'>
						<div
							className='scTop'
							style={{
								background: !this.state.isBusinessday || this.state.isWeekend ? '#E74A3B' : '#515151',
							}}
						>
							<p>{this.state.dayName}</p>
						</div>
						<div className='scBody'>
							<div className='scDate'>
								<p>{this.state.dayDate}.</p>
							</div>
							<div className='scHours' style={{ display: this.state.dayHour ? 'flex' : 'none' }}>
								<p className='schTime'>{this.state.dayHour} ur</p>
								<p className='schExcess'>
									<i
										className='fas fa-long-arrow-alt-up'
										style={{
											transform: 'rotate(' + this.state.arrowDeg + ')',
											color: this.state.arrowColor,
										}}
									></i>{' '}
									{this.state.dayHourExcess}
								</p>
							</div>
							<div
								className='scHoliday'
								style={{ display: this.state.isHoliday ? 'flex' : 'none' }}
							>
								<p>
									{this.state.holiday_name} <sup>{!this.state.isBusinessday ? '*' : ''}</sup>
								</p>
							</div>
						</div>
					</div>
				);
			} else {
				return (
					<div className='SmallCalendar'>
						<div className='scTop'></div>
						<div className='scBody' style={{ height: '100px' }}>
							<div className='scError'>{this.state.errMessage}</div>
						</div>
					</div>
				);
			}
		} else {
			return (
				<div className='SmallCalendar'>
					<div className='scTop'></div>
					<div className='scBody' style={{ height: '100px' }}>
						<div className='scLoading'>
							<i className='fas fa-sync-alt'></i>
						</div>
					</div>
				</div>
			);
		}
	}
}

export default SmallCalendar;

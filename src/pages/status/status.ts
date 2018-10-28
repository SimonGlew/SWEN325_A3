import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { AlertController } from 'ionic-angular';


import { Chart } from 'chart.js'

/**
 * Generated class for the StatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-status',
	templateUrl: 'status.html',
})
export class StatusPage {
	@ViewChild('chart') chart

	lastLocation: any;
	minutesSinceLastSeen: any;
	alertShowing: any;

	visualisation: any;

	//living, kitchen, dining, toilet, bedroom
	visualisationData: any;
	visualisationLabels: any;
	constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public alertCtrl: AlertController) {
		this.minutesSinceLastSeen = 0.00
		this.visualisationData = [0, 0, 0, 0, 0]
		this.lastLocation = 'Not yet seen.'
		this.visualisationLabels = ['Living', 'Kitchen', 'Dining', 'Toilet', 'Bedroom']

		this.alertShowing = false

		this.events.subscribe('message', (message) => {
			let data = message.message.split(',')
			if (data[2] == '1') {
				this.lastLocation = message.lastLocation
				this.visualisationData = message.visualisationData

				this.drawGraph()
				//draw visualisation again
			}
			this.minutesSinceLastSeen = this.getMinutesBetweenDates(message.lastSeen, new Date())
		})

		this.events.subscribe('latestInformation', (blob) => {
			this.minutesSinceLastSeen = this.getMinutesBetweenDates(blob.lastSeen, new Date())
			this.lastLocation = blob.lastLocation
			this.visualisationData = blob.visualisationData

			this.drawGraph()
		})

		this.events.subscribe('showAlert', (message) => {
			if (!this.alertShowing && this.navCtrl.parent.getSelected().index == 0) {
				this.alertShowing = true
				let confirm = this.alertCtrl.create({
					title: 'Inactivity Alert',
					buttons: [
						{
							text: 'Show Senior Status',
							handler: () => {
								this.alertShowing = false
							}
						}
					]
				});
				confirm.present();
			}

		})
		this.events.publish('getLatestInformation', {})
	}



	getMinutesBetweenDates = (startDate, endDate) => {
		var diff = endDate.getTime() - startDate.getTime();
		return (diff / 60000);
	}

	ionViewDidLoad() {
		this.drawGraph()
	}

	drawGraph() {
		if (this.chart && this.chart.nativeElement) {
			this.visualisation = new Chart(this.chart.nativeElement, {
				type: 'pie',
				data: {
					labels: this.visualisationLabels,
					datasets: [{
						label: 'Number of Movements',
						data: this.visualisationData,
						backgroundColor: [
							'rgba(255, 99, 132, 0.8)',
							'rgba(54, 162, 235, 0.8)',
							'rgba(255, 206, 86, 0.8)',
							'rgba(75, 192, 192, 0.8)',
							'rgba(153, 102, 255, 0.8)'
						],
						hoverBackgroundColor: [
							"#FF6384",
							"#36A2EB",
							"#FFCE56",
							"#FF6384",
							"#36A2EB"
						]
					}]
				}
			})
		}
	}
}

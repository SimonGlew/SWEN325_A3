import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { AlertController } from 'ionic-angular';


/**
 * Generated class for the BatteryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-battery',
	templateUrl: 'battery.html',
})
export class BatteryPage {
	batteryStatus: any
	alertShowing: any
	constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events, public alertCtrl: AlertController) {
		this.alertShowing = false
		this.batteryStatus = [
			{ room: 'Living', amount: 0 },
			{ room: 'Kitchen', amount: 0 },
			{ room: 'Dining', amount: 0 },
			{ room: 'Toilet', amount: 0 },
			{ room: 'Bedroom', amount: 0 }
		]

		this.events.subscribe('message', (message) => {
			let data = message.message.split(',')
			if (data[1] == 'living') {
				this.batteryStatus[0].amount = data[3]
			} else if (data[1] == 'kitchen') {
				this.batteryStatus[1].amount = data[3]
			} else if (data[1] == 'dining') {
				this.batteryStatus[2].amount = data[3]
			} else if (data[1] == 'toilet') {
				this.batteryStatus[3].amount = data[3]
			} else if (data[1] == 'bedroom') {
				this.batteryStatus[4].amount = data[3]
			}
		})

		this.events.subscribe('showAlert', (message) => {
			if (!this.alertShowing && this.navCtrl.parent.getSelected().index == 1) {
				this.alertShowing = true
				let confirm = this.alertCtrl.create({
					title: 'Inactivity Alert',
					buttons: [
						{
							text: 'Show Senior Status',
							handler: () => {
								this.alertShowing = false
								this.navCtrl.parent.select(0);
							}
						}
					]
				});
				confirm.present();
			}
		})
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad BatteryPage');
	}

}

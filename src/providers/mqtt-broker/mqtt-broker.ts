import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular'

declare var Paho: any;

/*
  Generated class for the MqttBrokerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MqttBrokerProvider {
  private alertShown: boolean
  private lastSeen: Date = new Date()
  private mqttStatus: string = 'Disconnected';
  private mqttClient: any = null;
  private topic: string = 'swen325/a3';
  private clientId: string = 'glewsimo'
  private visualisationData: any = [0,0,0,0,0]
  private lastLocation: any = 'Not seen yet.'


  constructor(public eventProvider: Events) {
    this.alertShown = false;
    console.log('Hello MqttBrokerProvider Provider');
    this.connect()

    this.eventProvider.subscribe('getLatestInformation', () => {
      this.eventProvider.publish('latestInformation', { lastSeen: this.lastSeen, lastLocation: this.lastLocation, visualisationData: this.visualisationData })
    })
  }

  public connect = () => {
    this.mqttStatus = 'Connecting...';
    this.mqttClient = new Paho.MQTT.Client('barretts.ecs.vuw.ac.nz', 8883, '/mqtt', this.clientId);

    // set callback handlers
    this.mqttClient.onConnectionLost = this.onConnectionLost;
    this.mqttClient.onMessageArrived = this.onMessageArrived;

    // connect the client
    console.log('Connecting to mqtt via websocket');
    this.mqttClient.connect({ timeout: 10, useSSL: false, onSuccess: this.onConnect, onFailure: this.onFailure });
  }

  public disconnect() {
    if (this.mqttStatus == 'Connected') {
      this.mqttStatus = 'Disconnecting...';
      this.mqttClient.disconnect();
      this.mqttStatus = 'Disconnected';
    }
  }

  public onConnect = () => {
    // subscribe
    this.mqttClient.subscribe(this.topic);
  }

  public onFailure = (responseObject) => {
    console.log('Failed to connect');
    this.mqttStatus = 'Failed to connect';
  }

  public onConnectionLost = (responseObject) => {

  }

  public onMessageArrived = (message) => {
    let data = message.payloadString.split(',')
    if (data[2] == '1') {
      this.lastSeen = new Date(data[0])
      this.alertShown = false

      this.lastLocation = data[1]

      if(data[1] == 'living'){
        this.visualisationData[0] += 1
      }else if(data[1] == 'kitchen'){
        this.visualisationData[1] += 1
      }else if(data[1] == 'dining'){
        this.visualisationData[2] += 1
      }else if(data[1] == 'toilet'){
        this.visualisationData[3] += 1
      }else if(data[1] == 'bedroom'){
        this.visualisationData[4] += 1
      }
    }

    if (this.getMinutesBetweenDates(this.lastSeen, new Date()) >= 5 && !this.alertShown) {
      this.alertShown = true
      this.eventProvider.publish('showAlert', {})
    }

    this.eventProvider.publish('message', { message: message.payloadString, lastSeen: this.lastSeen, lastLocation: this.lastLocation, visualisationData: this.visualisationData })
  }

  public getMinutesBetweenDates = (startDate, endDate) => {
    var diff = endDate.getTime() - startDate.getTime();
    return (diff / 60000);
  }

}

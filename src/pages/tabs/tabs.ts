import { Component } from '@angular/core';

import { StatusPage } from '../status/status';
import { BatteryPage } from '../battery/battery';
import { MqttBrokerProvider } from '../../providers/mqtt-broker/mqtt-broker';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = StatusPage;
  tab2Root = BatteryPage;

  constructor(public mqttBroker: MqttBrokerProvider) {

  }
}

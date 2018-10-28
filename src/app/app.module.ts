import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';

import { StatusPage } from '../pages/status/status'
import { BatteryPage } from '../pages/battery/battery'

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MqttBrokerProvider } from '../providers/mqtt-broker/mqtt-broker'

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    StatusPage,
    BatteryPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    StatusPage,
    BatteryPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    MqttBrokerProvider
  ]
})
export class AppModule { }

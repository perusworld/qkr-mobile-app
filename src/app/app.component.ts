import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PrefServiceProvider } from '../providers/pref-service/pref-service';
import { NfcServiceProvider } from '../providers/nfc-service/nfc-service';
import { QkrCheckoutServiceProvider } from '../providers/qkr-checkout-service/qkr-checkout-service';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, prefs: PrefServiceProvider, nfc: NfcServiceProvider, private qkrCheckout: QkrCheckoutServiceProvider) {
    platform.ready().then(() => {
      prefs.init().then(done => {
        console.log('prefs initialized');
        return nfc.init();
      }).then(done => {
        console.log('nfc initialized');
        return qkrCheckout.init();
      }).then(done => {
        console.log('qkrCheckout initialized');
      }).catch(failed => {
        console.log('failed to initialize prefs');
      })
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}


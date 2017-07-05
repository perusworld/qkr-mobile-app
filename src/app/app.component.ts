import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { PrefServiceProvider } from '../providers/pref-service/pref-service';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, prefs: PrefServiceProvider) {
    platform.ready().then(() => {
      prefs.init().then(done => {
        console.log('prefs initialized');
      }).catch(failed => {
        console.log('failed to initialize prefs');
      })
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}


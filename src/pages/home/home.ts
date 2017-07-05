import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';

import { CartPage } from '../cart/cart';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public showAuth = false;
  public showLogin = false;
  public credentials = {
    email: '',
    pwd: ''
  };

  constructor(public navCtrl: NavController, private auth: AuthServiceProvider, private cfg: ConfigServiceProvider) {
    console.log('Home Controller');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Home');
    this.cfg.presentLoading('Processing').then(resp => {
      return this.auth.hasAccount();
    }).then(status => {
      if (status) {
        this.showLogin = false;
        this.showAuth = true;
      } else {
        this.showAuth = false;
        this.showLogin = true;
      }
      this.cfg.hideLoading();
    }).catch(err => {
      console.error(err);
    });
  }

  /**
   * doLogin
   */
  public doLogin() {
    this.cfg.presentLoading('Authenticating ...').
      then(resp => {
        if (resp) { return this.auth.login(this.credentials) } else { throw 'Failed to initialize progress' }
      }).then(resp => {
        if (resp.status) { return this.cfg.hideLoading() } else { throw resp }
      }).then(status => {
        if (status) { return this.cfg.showAlert('Authentication Success!', "") } else { throw 'Failed to clear progress' }
      }).then(status => {
        if (status) { return this.navCtrl.push(CartPage, {}) } else { throw 'Failed to initialize progress again' }
      }).then(resp => {
        //NOOP
      }).catch(err => {
        console.log(err);
        this.cfg.hideLoading().then(resp => {
          this.cfg.showAlert('Authentication Failed!', JSON.stringify(err, null, 2));
        });
      });
  }


  /**
   * doAuth
   */
  public doAuth() {
    this.auth.auth().then(resp => {
      if (resp.status) { return this.cfg.showAlert('Authentication Success!', "") } else { throw resp }
    }).then(status => {
      if (status) { return this.navCtrl.push(CartPage, {}) } else { throw 'Failed to initialize progress again' }
    }).then(resp => {
      console.log(resp);
    }).catch(err => {
      console.error(err);
      this.cfg.showAlert('Authentication Failed!', JSON.stringify(err, null, 2));
    });
  }

}

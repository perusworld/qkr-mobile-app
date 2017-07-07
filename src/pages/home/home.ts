import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { NfcServiceProvider } from '../../providers/nfc-service/nfc-service';

import { CartPage } from '../cart/cart';
import { CheckoutPage } from '../checkout/checkout';

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

  private eventParams: string[] = null;
  private initialized = false;

  constructor(public navCtrl: NavController, private auth: AuthServiceProvider, private cfg: ConfigServiceProvider, private nfc: NfcServiceProvider) {
    console.log('Home Controller');
    this.nfc.onMsg.subscribe((msg) => {
      this.eventParams = msg.split(':');
      if (this.initialized) {
        this.checkAuth();
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Home');
    this.initAuth();
  }

  /**
   * initAuth
   */
  public initAuth() {
    this.cfg.presentLoading('Loading ...').then(resp => {
      return this.auth.hasAccount();
    }).then(status => {
      if (status) {
        this.showLogin = false;
        this.showAuth = true;
      } else {
        this.showAuth = false;
        this.showLogin = true;
      }
      if (!this.initialized) {
        this.initialized = true;
      }
      this.cfg.hideLoading();
    }).catch(err => {
      console.error(err);
      this.cfg.hideLoading().then(resp => {
        this.cfg.showAlert('Initialization Failed!', JSON.stringify(err, null, 2));
      });
    });
  }

  /**
   * checkAuth
   */
  public checkAuth() {
    if (this.auth.hasAuthenticated()) {
      this.onAuth();
    } else {
      this.initAuth();
    }
  }

  /**
   * onAuth
   */
  public onAuth() {
    if (this.eventParams) {
      let params = this.eventParams;
      this.eventParams = null;
      switch (params[0]) {
        case 'check-in':
          this.navCtrl.push(CartPage, { checkin: true });
          break;
        case 'check-out':
          this.navCtrl.push(CheckoutPage, { checkout: true });
          break;
        case 'add-item':
          this.navCtrl.push(CartPage, { addItem: { id: params[1], qty: Number.parseInt(params[2]) } });
          break;
        default:
          console.error('Unknown command', params[0]);
          break;
      }
    } else {
      this.navCtrl.push(CartPage, {});
    }
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
        if (status) { this.onAuth() } else { throw 'Failed to clear progress' }
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
      if (resp.status) { this.onAuth() } else { throw resp }
    }).catch(err => {
      console.error(err);
      this.cfg.showAlert('Authentication Failed!', JSON.stringify(err, null, 2));
      this.credentials.pwd = '';
      this.showAuth = false;
      this.showLogin = true;
    });
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { QkrCheckoutServiceProvider } from '../../providers/qkr-checkout-service/qkr-checkout-service';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';

import { CartPage } from '../cart/cart';

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {

  public cart: any = {};
  public card: any = {};
  public paymentEnabled = false;
  private params: any = null;;
  constructor(public navCtrl: NavController, public navParams: NavParams, private qkrCheckout: QkrCheckoutServiceProvider, private auth: AuthServiceProvider, private cfg: ConfigServiceProvider) {
    this.params = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
    this.paymentEnabled = false;
    this.loadCart();
  }

  /**
 * loadCart
 */
  public loadCart() {
    this.cfg.presentLoading('Loading ...').then(resp => {
      return this.qkrCheckout.getDefaultCheckout();
    }).then(resp => {
      if (resp.cart) {
        this.cart = resp.cart;
        this.card = resp.card;
        this.paymentEnabled = true;
        this.cfg.hideLoading();
      } else {
        throw resp.err;
      }
    }).catch(err => {
      console.error(err);
      this.cfg.hideLoading().then(resp => {
        this.cfg.showAlert('Cart Load Failed!', JSON.stringify(err, null, 2));
      });
    });
  }

  /**
   * cartList
   */
  public cartList() {
    this.navCtrl.push(CartPage, {});
  }

  /**
   * checkout
   */
  public checkout() {
    this.cfg.presentLoading('Processing ...').then(resp => {
      return this.qkrCheckout.checkout(this.card, this.cart);
    }).then(status => {
      this.paymentEnabled = false;
      return this.cfg.showAlert('Checkout completed successfuly!', `${status.thankYouMessage} this is your reference number ${status.ref}`)
    }).then(status => {
      this.cfg.hideLoading();
    }).catch(err => {
      console.error(err);
      this.cfg.hideLoading().then(resp => {
        this.cfg.showAlert('Checkout Failed!', JSON.stringify(err, null, 2));
      });
    });
  }


}

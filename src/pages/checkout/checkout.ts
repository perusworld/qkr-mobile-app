import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { QkrServiceProvider } from '../../providers/qkr-service/qkr-service';
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
  constructor(public navCtrl: NavController, public navParams: NavParams, private qkr: QkrServiceProvider, private auth: AuthServiceProvider, private cfg: ConfigServiceProvider) {
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
      return this.qkr.carts(this.auth.authToken);
    }).then(resp => {
      if (0 < resp.length) {
        this.cart = resp[0];
        return this.qkr.cards(this.auth.authToken);
      } else {
        throw 'Empty Cart';
      }
    }).then(resp => {
      if (0 < resp.length) {
        this.card = resp[0];
        this.paymentEnabled = true;
        this.cfg.hideLoading();
      } else {
        throw 'No Card';
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
      return this.qkr.checkout(this.auth.authToken, {
        amountMinorUnits: this.cart.amountMinorUnits,
        cardId: this.card.id,
        cartId: this.cart.cartId,
        tipAmount: 0
      });
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

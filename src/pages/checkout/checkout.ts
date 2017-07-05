import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { QkrServiceProvider } from '../../providers/qkr-service/qkr-service';

import { CartPage } from '../cart/cart';

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {

  public cart: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, private qkr: QkrServiceProvider, private auth: AuthServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
    this.loadCart();
  }

  /**
 * loadCart
 */
  public loadCart() {
    this.qkr.carts(this.auth.authToken).
      then(resp => {
        if (0 < resp.length) {
          this.cart = resp[0];
        }
      }).catch(err => {
        console.log(err);
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
  }


}

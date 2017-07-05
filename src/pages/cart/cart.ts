import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { QkrServiceProvider } from '../../providers/qkr-service/qkr-service';

import { ProductListPage } from '../product-list/product-list';
import { CheckoutPage } from '../checkout/checkout';

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  public cart: any = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, private qkr: QkrServiceProvider, private auth: AuthServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');
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
   * addProduct
   */
  public addProduct() {
    this.navCtrl.push(ProductListPage, {});
  }

  /**
   * removeProduct
product: any   */
  public removeProduct(product: any) {
    console.log(product);
  }

  /**
   * checkout
   */
  public checkout() {
    this.navCtrl.push(CheckoutPage, {});
  }

}

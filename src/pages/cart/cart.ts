import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { QkrCheckoutServiceProvider } from '../../providers/qkr-checkout-service/qkr-checkout-service';

import { ProductListPage } from '../product-list/product-list';
import { CheckoutPage } from '../checkout/checkout';

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  public cart: any = {};
  private params: any = null;;
  constructor(public navCtrl: NavController, public navParams: NavParams, private qkrCheckout: QkrCheckoutServiceProvider, private auth: AuthServiceProvider, private cfg: ConfigServiceProvider) {
    this.params = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');
    this.loadCart();
  }

  /**
   * loadCart
   */
  public loadCart() {
    this.cfg.presentLoading('Loading cart ...').then(resp => {
      return this.qkrCheckout.carts();
    }).then(resp => {
      if (0 < resp.length) {
        this.cart = resp[0];
      }
      return this.cfg.hideLoading();
    }).then(status => {
      if (this.params && this.params.checkin) {
        return this.cfg.showAlert('Success', 'Checkin successfull, continue shopping');
      } else if (this.params && this.params.addItem) {
        return this.cfg.presentLoading('Adding item to cart ...').then(status => {
          return this.qkrCheckout.addToCart(this.params.addItem.id, this.params.addItem.qty, 'nfc buy');
        }).then(status => {
          if (status) { return this.qkrCheckout.carts() } else { throw 'Cart add failed' }
        }).then(resp => {
          if (0 < resp.length) {
            this.cart = resp[0];
          }
          return this.cfg.hideLoading();
        }).then(resp => {
          return this.cfg.showAlert('Success', 'Added item to cart, continue shopping');
        });
      } else {
        return true;
      }
    }).then(resp => {
      //NOOP
    }).catch(err => {
      console.log(err);
      this.cfg.hideLoading().then(resp => {
        this.cfg.showAlert('Failed!', JSON.stringify(err, null, 2));
      });
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

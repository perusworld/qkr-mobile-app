import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { QkrCheckoutServiceProvider } from '../../providers/qkr-checkout-service/qkr-checkout-service';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';

import { CartPage } from '../cart/cart';

@IonicPage()
@Component({
  selector: 'page-product-list',
  templateUrl: 'product-list.html',
})
export class ProductListPage {

  public menu = <any>[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private qkrCheckout: QkrCheckoutServiceProvider, private cfg: ConfigServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductListPage');
    this.menu = this.qkrCheckout.menu;
  }

  /**
   * addProduct
   */
  public addProduct(product: any) {
    this.cfg.presentLoading('Adding to cart').
      then(resp => {
        if (resp) { return this.qkrCheckout.addToCart(product.variants[0].id, 1, `Buying ${product.name}`) } else { throw 'Failed to initialize progress' }
      }).then(resp => {
        return this.cfg.hideLoading();
      }).then(status => {
        if (status) { return this.cfg.showAlert('Added to cart!', "") } else { throw 'Failed to clear progress' }
      }).catch(err => {
        console.log(err);
        this.cfg.hideLoading().then(resp => {
          this.cfg.showAlert('Adding to cart failed!', JSON.stringify(err, null, 2));
        });
      });
  }

  /**
   * cartList
   */
  public cartList() {
    this.navCtrl.push(CartPage, {});
  }

}

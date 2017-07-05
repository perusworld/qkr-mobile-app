import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { QkrServiceProvider } from '../../providers/qkr-service/qkr-service';
import { ConfigServiceProvider } from '../../providers/config-service/config-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

import { CartPage } from '../cart/cart';

@IonicPage()
@Component({
  selector: 'page-product-list',
  templateUrl: 'product-list.html',
})
export class ProductListPage {

  private merchantId: string;
  private outletId: string;
  private menuId: string;
  public menu = <any>[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private qkr: QkrServiceProvider, private cfg: ConfigServiceProvider, private auth: AuthServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductListPage');
    this.loadProducts();
  }

  /**
   * loadProducts
   */
  public loadProducts() {
    this.qkr.merchants().
      then(resp => {
        this.merchantId = resp[0].id;
        this.outletId = resp[0].outlets[0].id;
        this.menuId = resp[0].outlets[0].prodGroupSummaries[0].id
        return this.qkr.products(this.menuId);
      }).then(resp => {
        this.menu = resp;
      }).catch(err => {
        console.log(err);
      });
  }

  /**
   * addProduct
   */
  public addProduct(product: any) {
    this.cfg.presentLoading('Adding to cart').
      then(resp => {
        if (resp) {
          return this.qkr.addCart(this.auth.authToken, {
            locatedScanId: this.menu.locatedScanId,
            outletId: this.outletId,
            purchaseNote: `Buying ${product.name}`,
            quantity: 1,
            variantId: product.variants[0].id
          });
        } else { throw 'Failed to initialize progress' }
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

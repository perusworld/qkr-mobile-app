import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { QkrServiceProvider } from '../qkr-service/qkr-service';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Injectable()
export class QkrCheckoutServiceProvider {

  public merchantId: string;
  public outletId: string;
  public menuId: string;

  public menu = <any>[];

  constructor(public http: Http, private qkr: QkrServiceProvider, private auth: AuthServiceProvider) {
    console.log('Hello QkrCheckoutServiceProvider Provider');
  }

  /**
   * init
   */
  public init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.qkr.merchants().then(resp => {
        this.merchantId = resp[0].id;
        this.outletId = resp[0].outlets[0].id;
        this.menuId = resp[0].outlets[0].prodGroupSummaries[0].id
        return this.qkr.products(this.menuId);
      }).then(resp => {
        this.menu = resp;
        resolve(true);
      }).catch(err => {
        console.log(err);
        reject(true);
      });
    });
  }

  /**
   * cards
   */
  public cards(): Promise<any> {
    return this.qkr.cards(this.auth.authToken);
  }

  /**
   * carts
   */
  public carts(): Promise<any> {
    return this.qkr.carts(this.auth.authToken);
  }

  /**
   * addToCart
id: string, qty: number   */
  public addToCart(id: any, qty: number, note: string): Promise<boolean> {
    return this.qkr.addCart(this.auth.authToken, {
      locatedScanId: this.menu.locatedScanId,
      outletId: this.outletId,
      purchaseNote: note,
      quantity: qty,
      variantId: id
    }).then(resp => {
      if (resp && resp.error) {
        console.error(resp);
        return false;
      } else {
        return true;
      }
    }).catch(err => {
      console.error(err);
      return true;
    });
  }

  /**
   * getDefaultCheckout
 :Promise<{cardId: string}>  */
  public getDefaultCheckout(): Promise<{ card?: any, cart?: any, err?: any }> {
    let ctx = <any>{};
    return this.carts().then(resp => {
      if (0 < resp.length) {
        ctx.cart = resp[0];
        return this.cards();
      } else {
        throw 'Empty Cart';
      }
    }).then(resp => {
      if (0 < resp.length) {
        ctx.card = resp[0];
        return ctx;
      } else {
        throw 'No Card';
      }
    }).catch(err => {
      console.error(err);
      return {
        err: err
      }
    });
  }

  /**
   * checkout
 card: any, cart: any :Promise<any>  */
  public checkout(card: any, cart: any, tipAmount: number = 0): Promise<any> {
    return this.qkr.checkout(this.auth.authToken, {
      amountMinorUnits: cart.amountMinorUnits,
      cardId: card.id,
      cartId: cart.cartId,
      tipAmount: tipAmount
    });
  }

}

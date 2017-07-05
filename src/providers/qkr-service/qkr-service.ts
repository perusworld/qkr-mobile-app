import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { ConfigServiceProvider } from '../config-service/config-service';

@Injectable()
export class QkrServiceProvider {

  constructor(public http: Http, private cfg: ConfigServiceProvider) {
    console.log('Hello QkrServiceProvider Provider');
  }

  public send(ctx: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      this.http.post(this.cfg.urlPrefix() + ctx.endpoint, JSON.stringify(ctx.request), { headers: headers })
        .map(resp => resp.json())
        .subscribe(resp => {
          resolve(resp);
        }, err => {
          reject(err);
        });
    });
  }

  public login(email: string, pwd: string): Promise<any> {
    return this.send({
      endpoint: 'login',
      request: {
        email: email,
        pwd: pwd
      }
    });
  }

  public merchants(): Promise<any> {
    return this.send({
      endpoint: 'merchant/list',
      request: {
      }
    });
  }

  public products(id: string): Promise<any> {
    return this.send({
      endpoint: 'product/list',
      request: {
        id: id
      }
    });
  }

  public carts(authToken: any): Promise<any> {
    return this.send({
      endpoint: 'cart/list',
      request: {
        token: authToken.accessToken.token
      }
    });
  }

  public addCart(authToken: any, req: any): Promise<any> {
    return this.send({
      endpoint: 'cart/add',
      request: {
        token: authToken.accessToken.token,
        request: req
      }
    });
  }

  public cards(authToken: any): Promise<any> {
    return this.send({
      endpoint: 'cards/list',
      request: {
        token: authToken.accessToken.token
      }
    });
  }
}

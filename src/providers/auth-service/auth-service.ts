import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';

import { ConfigServiceProvider } from '../config-service/config-service';
import { PrefServiceProvider } from '../../providers/pref-service/pref-service';
import { QkrServiceProvider } from '../../providers/qkr-service/qkr-service';

@Injectable()
export class AuthServiceProvider {

  private static TOKEN_NAME = 'auth-credentials';

  public authToken = null;

  constructor( @Inject('APP_NAME') public clientId: string, public http: Http, private fingerprintAuth: AndroidFingerprintAuth, private prefs: PrefServiceProvider, private qkr: QkrServiceProvider, private cfg: ConfigServiceProvider) {
    console.log('Hello AuthServiceProvider Provider');
  }

  /**
   * hasAuthenticated
   */
  public hasAuthenticated() {
    return null != this.authToken;
  }

  /**
   * hasAccount
   */
  public hasAccount(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.prefs.getPref<any>(AuthServiceProvider.TOKEN_NAME).then(token => {
        let has = null != token && token.accessToken && token.accessToken.token;
        if (!has) { this.authToken = null; }
        resolve(has);
      }).catch(err => {
        resolve(false);
      });
    });
  }

  /**
   * login
   */
  public login(credentials: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.qkr.login(credentials.email, credentials.pwd).
        then(resp => {
          if (resp.accessToken && resp.accessToken.token) {
            this.authToken = resp;
            return this.prefs.setPref(AuthServiceProvider.TOKEN_NAME, credentials);
          } else {
            throw resp;
          }
        }).then(resp => {
          resolve({
            status: true
          })
        }).catch(err => {
          this.authToken = null;
          reject({
            status: false,
            error: err
          });
        })
    });
  }

  /**
   * auth
   */
  public auth(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cfg.resultPromise(this.cfg.isMock()).
        then(status => {
          if (status) {
            return this.cfg.resultPromise({ withFingerprint: true });
          } else {
            return this.fingerprintAuth.isAvailable().
              then(available => {
                if (available) {
                  return this.fingerprintAuth.encrypt({
                    clientId: this.clientId
                  })
                } else {
                  throw 'Fingerprint not available';
                }
              });
          }
        }).then(resp => {
          console.log('fingerprint success', resp);
          return this.prefs.getPref<any>(AuthServiceProvider.TOKEN_NAME);
        }).then(resp => {
          return this.login(resp);
        }).catch(err => {
          console.log(err);
          reject({
            status: false,
            error: err
          });
        });
    });
  }

}

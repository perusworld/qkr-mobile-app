import { Injectable } from '@angular/core';
import { Platform, LoadingController, Loading, AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';

@Injectable()
export class ConfigServiceProvider {

  public mockPrefs = {
    'auth-credentials': {
      success: true,
      result: null
    }
  };

  private loader: Loading;

  constructor(public platform: Platform, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
  }

  /**
   * isMock
   */
  public isMock(): boolean {
    return this.platform.is('core');
  }

  /**
   * resultPromise
   */
  public resultPromise<T>(res: T, success: boolean = true): Promise<T> {
    return new Promise((resolve, reject) => {
      success ? resolve(res) : reject(res);
    });
  }

  /**
     * urlPrefix
     */
  public urlPrefix() {
    return "http://localhost:3000/api/v1/";
  }

  presentLoading(msg: string): Promise<any> {
    this.loader = this.loadingCtrl.create({
      content: msg
    });
    return this.loader.present();
  }

  hideLoading(): Promise<any> {
    if (this.loader) {
      return this.loader.dismiss().then(resp => { this.loader = null; return true });
    } else {
      return this.resultPromise(true);
    }
  }

  showAlert(title: string, subtitle: string): Promise<any> {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subtitle,
      buttons: ['OK']
    });
    return alert.present();
  }


}

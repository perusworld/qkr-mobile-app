import { Injectable, Inject } from '@angular/core';
import 'rxjs/add/operator/map';

import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';

import { ConfigServiceProvider } from '../config-service/config-service';

@Injectable()
export class MockPrefServiceProvider {

  constructor(private cfg: ConfigServiceProvider) {
    console.log('Hello MockPrefServiceProvider Provider');
  }

  /**
   * mockPrefValue
   */
  public mockPrefValue<T>(key: string, defVal: T = null, defSuccess: boolean = true): Promise<T> {
    let val = this.cfg.mockPrefs[key];
    if (!val) {
      val = {
        success: defSuccess,
        result: defVal
      };
    }
    return this.cfg.resultPromise(val.result, val.success);
  }

  /**
   * setMockPref
   */
  public setMockPref<T>(key: string, val: T = null, success: boolean = true): Promise<T> {
    return new Promise((resolve, reject) => {
      this.cfg.mockPrefs[key] = {
        success: success,
        result: val
      };
      resolve(true);
    });
  }


}

@Injectable()
export class PrefServiceProvider {

  private static OBJECT_KEY = '__object__:';

  private storage: SecureStorageObject;
  constructor( @Inject('APP_NAME') public storageName: string, public storageProvider: SecureStorage, private cfg: ConfigServiceProvider, private mockPrefs: MockPrefServiceProvider) {
    console.log('Hello PrefServiceProvider Provider', storageName);
  }

  /**
   * init
   */
  public init(): Promise<boolean> {
    if (this.cfg.isMock()) {
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    } else {
      return this.storageProvider.create(this.storageName).then((storage: SecureStorageObject) => {
        this.storage = storage;
        return true;
      }).catch(err => {
        console.error(err);
        return false;
      });

    }
  }

  /**
   * getPref key:string   
   */
  public getPref<T>(key: string): Promise<T> {
    return this.cfg.isMock() ? this.mockPrefs.mockPrefValue(key) : this.storage.get(key).then(val => this.unstringify(val));
  }

  /**
   * setPref
   */
  public setPref<T>(key: string, value: T): Promise<any> {
    return this.cfg.isMock() ? this.mockPrefs.setMockPref(key, value) : this.storage.set(key, this.stringify(value));
  }

  protected stringify(value: any): string {
    return typeof value == 'object' ? PrefServiceProvider.OBJECT_KEY + JSON.stringify(value) : value;
  }

  protected unstringify<T>(value: string): Promise<T> {
    return this.cfg.resultPromise(value.startsWith(PrefServiceProvider.OBJECT_KEY) ? JSON.parse(value.substr(PrefServiceProvider.OBJECT_KEY.length)) : value);
  }

}

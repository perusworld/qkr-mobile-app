import { Injectable, Inject, } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { NFC, Ndef } from '@ionic-native/nfc';
import { Subject } from 'rxjs/Subject';

import { ConfigServiceProvider } from '../config-service/config-service';

@Injectable()
export class NfcServiceProvider {

  onMsg: Subject<string> = new Subject();

  constructor( @Inject('NFC_TAG_NAME') public nfcTagName: string, public http: Http, private nfc: NFC, private ndef: Ndef, private cfg: ConfigServiceProvider) {
    console.log('Hello NfcServiceProvider Provider');
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
      return new Promise((resolve, reject) => {
        this.nfc.addMimeTypeListener(this.nfcTagName, () => {
          console.log('Registered for mime type');
          resolve(true);
        }, (err) => {
          console.error('Mime type registration failed', err);
          reject(false);
        }).subscribe(nfcEvent => {
          nfcEvent.tag.ndefMessage.forEach(entry => {
            this.onMsg.next(this.nfc.bytesToString(entry.payload));
          });
        });
      });
    }
  }

}

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { HttpModule } from '@angular/http';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { SecureStorage } from "@ionic-native/secure-storage";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { CartPage } from '../pages/cart/cart';
import { CheckoutPage } from '../pages/checkout/checkout';
import { ProductListPage } from '../pages/product-list/product-list';

import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { PrefServiceProvider, MockPrefServiceProvider } from '../providers/pref-service/pref-service';
import { QkrServiceProvider } from '../providers/qkr-service/qkr-service';
import { ConfigServiceProvider } from '../providers/config-service/config-service';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    CartPage,
    CheckoutPage,
    ProductListPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    CartPage,
    CheckoutPage,
    ProductListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: 'APP_NAME', useValue: 'qkr-mobile-app' },
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AndroidFingerprintAuth,
    SecureStorage,
    AuthServiceProvider,
    PrefServiceProvider,
    MockPrefServiceProvider,
    QkrServiceProvider,
    ConfigServiceProvider
  ]
})
export class AppModule { }

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {OneSignal} from '@ionic-native/onesignal/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {IonicStorageModule} from '@ionic/storage';
//import { ScrollingModule } from '@angular/cdk/scrolling/ngx';
//import { DragDropModule } from '@angular/cdk/drag-drop/ngx';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';
import {AppRate} from '@ionic-native/app-rate/ngx';
import {AppMinimize} from '@ionic-native/app-minimize/ngx';
import {EmailComposer} from '@ionic-native/email-composer/ngx';
//import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
//import { CardIO } from '@ionic-native/card-io/ngx';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';

import {KeysPipeModule} from '../app/pipes/pipe.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
//import { Braintree } from '@ionic-native/braintree/ngx';
import {HomePage} from './home/home.page';
import {HTTP} from '@ionic-native/http/ngx';

//Uncomment when you use Google Login
import {GooglePlus} from '@ionic-native/google-plus/ngx';
import {Facebook} from '@ionic-native/facebook/ngx';

//vendor
import {ImagePicker} from '@ionic-native/image-picker/ngx';
import {Crop} from '@ionic-native/crop/ngx';
import {FileTransfer} from '@ionic-native/file-transfer/ngx';

//pages
import {FilterPage} from '../app/filter/filter.page';
import {OrderSummaryPage} from './checkout/order-summary/order-summary.page';
import {LocationPage} from '../app/location/location.page';

import {AndroidPermissions} from '@ionic-native/android-permissions/ngx';
//Geolocation
//import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {NativeGeocoder} from '@ionic-native/native-geocoder/ngx';
import {LocationAccuracy} from '@ionic-native/location-accuracy/ngx';
import {YoutubeVideoPlayer} from '@ionic-native/youtube-video-player/ngx';
import {YtService} from './yt.service';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';

//Firebase
//import { AngularFireModule } from '@angular/fire';
//import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    AppComponent,
    FilterPage,
    OrderSummaryPage,
    LocationPage
    //HomePage
  ],
  entryComponents: [
    FilterPage,
    OrderSummaryPage,
    LocationPage
    //HomePage
  ],
  imports: [BrowserModule,
    FormsModule,
    HttpClientModule,
    KeysPipeModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(),
    AppRoutingModule,
    //AngularFireModule.initializeApp(environment.firebase, 'test'),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],

  providers: [
    StatusBar,
    SplashScreen,
    HomePage,
    //Braintree,
    GooglePlus,
    Facebook,
    OneSignal,
    NativeStorage,
    InAppBrowser,
    FormBuilder,
    //CardIO,
    ReactiveFormsModule,
    AppMinimize,
    EmailComposer,
    AppRate,
    ImagePicker,
    Crop,
    YtService,
    YoutubeVideoPlayer,
    FileTransfer,
    SocialSharing,
    //BarcodeScanner,
    HTTP,
    AndroidPermissions,
    Geolocation, LocationAccuracy, NativeGeocoder,
    //FirebaseAuthentication,
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

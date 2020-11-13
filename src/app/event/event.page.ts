import {Component, OnInit} from '@angular/core';
import {AlertController, IonRouterOutlet, LoadingController, ModalController, NavController, Platform} from '@ionic/angular';
import {NativeGeocoder} from '@ionic-native/native-geocoder/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {LocationAccuracy} from '@ionic-native/location-accuracy/ngx';
import {Storage} from '@ionic/storage';
import {TranslateService} from '@ngx-translate/core';
import {Config} from '../config';
import {ApiService} from '../api.service';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {Data} from '../data';
import {Settings} from '../data/settings';
import {Product} from '../data/product';
import {ActivatedRoute, Router} from '@angular/router';
import {OneSignal} from '@ionic-native/onesignal/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-event',
  templateUrl: './event.page.html',
  styleUrls: ['./event.page.scss'],
})
export class EventPage implements OnInit {

  event;
  id;

  constructor(public routerOutlet: IonRouterOutlet, public modalCtrl: ModalController, private nativeGeocoder: NativeGeocoder, private geolocation: Geolocation, private locationAccuracy: LocationAccuracy, private storage: Storage, public translate: TranslateService, public alertController: AlertController, private config: Config, public api: ApiService, private splashScreen: SplashScreen, public platform: Platform, public translateService: TranslateService, public data: Data, public settings: Settings, public product: Product, public loadingController: LoadingController, public router: Router, public navCtrl: NavController, public route: ActivatedRoute, private oneSignal: OneSignal, private nativeStorage: NativeStorage) {
    this.id = this.route.snapshot.paramMap.get('id');
    console.log(this.id);
  }

  ngOnInit() {
    this.getEvents();
  }

  getEvents() {
    this.api.get('/mec-events/' + this.id, 'Getting Event', true).then(res => {
      this.event = res;
      console.log(this.event);
    }, err => {
    });
  }
}

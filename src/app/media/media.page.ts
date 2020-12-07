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
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import {OneSignal} from '@ionic-native/onesignal/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {YtService} from '../yt.service';
import {YoutubeVideoPlayer} from '@ionic-native/youtube-video-player/ngx';
import {InAppBrowser, InAppBrowserOptions} from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-media',
  templateUrl: './media.page.html',
  styleUrls: ['./media.page.scss'],
})
export class MediaPage implements OnInit {
  apiKey = 'AIzaSyCFzxhusAXpBUeczr0hgkCsm9yLruMiE_w';
  channel = 'UCMn4su-YZwx8WWMb46elLjw';
  playlists;
  videos;
  nextpageToken;
  prevpageToken;
  option: InAppBrowserOptions = {
    location: 'yes',//Or 'no'
    hidden: 'no', //Or  'yes'
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'yes',//Android only ,shows browser zoom controls
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', //Android only
    closebuttoncaption: 'Close', //iOS only
    disallowoverscroll: 'no', //iOS only
    toolbar: 'yes', //iOS only
    enableViewportScale: 'no', //iOS only
    allowInlineMediaPlayback: 'no',//iOS only
    presentationstyle: 'pagesheet',//iOS only
    fullscreen: 'yes',//Windows only
  };


  constructor(public routerOutlet: IonRouterOutlet, public iab: InAppBrowser, public apiService: ApiService, private youtube: YoutubeVideoPlayer, private plt: Platform, public yt: YtService, public modalCtrl: ModalController, private nativeGeocoder: NativeGeocoder, private geolocation: Geolocation, private locationAccuracy: LocationAccuracy, private storage: Storage, public translate: TranslateService, public alertController: AlertController, private config: Config, public api: ApiService, private splashScreen: SplashScreen, public platform: Platform, public translateService: TranslateService, public data: Data, public settings: Settings, public product: Product, public loadingController: LoadingController, public router: Router, public navCtrl: NavController, public route: ActivatedRoute, private oneSignal: OneSignal, private nativeStorage: NativeStorage) {
  }

  ngOnInit() {
    this.getVideosForChannel();
  }

  getVideosForChannel() {
    let pageToken = '';
    if (this.nextpageToken !== null && this.nextpageToken !== undefined) {
      pageToken = '&pageToken =' + this.nextpageToken;
    }
    this.apiService.presentLoading();
    this.yt.getFromFile('https://www.holylifeministriesint.org/crons/getYoutubeList.php').then((videos) => {
      console.log(videos);
      this.videos = videos.items;
      this.nextpageToken = videos.nextPageToken;
      this.prevpageToken = videos.prevPageToken;
      this.apiService.dismisLoading();
    }).catch((err) => {
      console.log('Error::', err);
      this.apiService.dismisLoading();
    });
  }

  getPlaylistsForChannel() {
    this.yt.get('/playlists?key=' + this.apiKey + '&channelId=' + this.channel + '&part=snippet,id&maxResults=20').then((playlist) => {
      console.log(playlist);
      this.playlists = playlist;
    }).catch((err) => {
      console.log('Error::', err);
    });
  }

  getListVideos(listId) {
    this.yt.get('/playlistItems?key=' + this.apiKey + '&playlistId=' + listId + '&part=snippet,id&maxResults=20').then((videos) => {
      console.log(videos);
      this.videos = videos;
    }).catch((err) => {
      console.log('Error::', err);
    });

  }

  openVideo(video) {
    if (this.plt.is('desktop')) {
      this.youtube.openVideo(video);
    } else {
      this.openLink('https://www.youtube.com/watch?v=' + video);
    }
  }

  openPlaylist(id) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        id: id
      }
    };
    this.router.navigate(['playlist'], navigationExtras);
  }

  openLink(url) {
    this.iab.create(url, '_system', this.option);

  }

}

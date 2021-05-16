import {Component} from '@angular/core';
import {AlertController, IonRouterOutlet, LoadingController, ModalController, NavController, Platform} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../api.service';
import {Data} from '../data';
import {Settings} from '../data/settings';
import {Product} from '../data/product';
import {OneSignal} from '@ionic-native/onesignal/ngx';
import {NativeStorage} from '@ionic-native/native-storage/ngx';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {Config} from '../config';
import {TranslateService} from '@ngx-translate/core';
import {Storage} from '@ionic/storage';
import {LocationPage} from '../location/location.page';
import {LocationAccuracy} from '@ionic-native/location-accuracy/ngx';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {NativeGeocoder} from '@ionic-native/native-geocoder/ngx';
import {Post} from '../data/post';
import {InAppBrowser, InAppBrowserOptions} from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  tempProducts: any = [];
  filter: any = {};
  hasMoreItems: boolean = true;
  screenWidth: any = 300;
  slideOpts = {effect: 'flip', autoplay: true, parallax: true, loop: false, lazy: true};

  cart: any = {};
  options: any = {};
  lan: any = {};
  variationId: any;
  get_wishlist: any;
  loading: any = false;
  posts;
  events: any;
  mobileEvents = [];
  sliders = [];
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

  constructor(public routerOutlet: IonRouterOutlet, public iab: InAppBrowser, public post: Post, public modalCtrl: ModalController, private nativeGeocoder: NativeGeocoder, private geolocation: Geolocation, private locationAccuracy: LocationAccuracy, private storage: Storage, public translate: TranslateService, public alertController: AlertController, private config: Config, public api: ApiService, private splashScreen: SplashScreen, public platform: Platform, public translateService: TranslateService, public data: Data, public settings: Settings, public product: Product, public loadingController: LoadingController, public router: Router, public navCtrl: NavController, public route: ActivatedRoute, private oneSignal: OneSignal, private nativeStorage: NativeStorage) {
    this.filter.page = 1;
    this.filter.status = 'publish';
    this.screenWidth = this.platform.width();
  }

  ngOnInit() {
    this.getEvents();
    this.platform.ready().then(() => {

      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        if (canRequest) {
          // the accuracy option will be ignored by iOS
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => {

              console.log('Request successful');
            },
            error => {
              console.log('Error requesting location permissions', error);
            });
        }
      });
      // Set language to user preference
      this.nativeStorage.getItem('settings').then((settings: any) => {
        this.config.lang = settings.lang;
        document.documentElement.setAttribute('dir', settings.dir);
      }, error => {
      });

      this.storage.get('userLocation').then((value: any) => {
        if (value) {
          this.api.userLocation = value;
        }
        this.getBlocks();
      }, error => {
        this.getBlocks();
      });
      this.translate.get(['Oops!', 'Please Select', 'Please wait', 'Options', 'Option', 'Select', 'Item added to cart', 'Message', 'Requested quantity not available']).subscribe(translations => {
        this.lan.oops = translations['Oops!'];
        this.lan.PleaseSelect = translations['Please Select'];
        this.lan.Pleasewait = translations['Please wait'];
        this.lan.options = translations['Options'];
        this.lan.option = translations['Option'];
        this.lan.select = translations['Select'];
        this.lan.addToCart = translations['Item added to cart'];
        this.lan.message = translations['Message'];
        this.lan.lowQuantity = translations['Requested quantity not available'];
      });

      this.nativeStorage.getItem('blocks').then(data => {
        this.data.blocks = data.blocks;
        this.data.categories = data.categories;
        this.data.mainCategories = this.data.categories.filter(item => item.parent == 0);
        this.settings.pages = this.data.blocks.pages;
        this.settings.settings = this.data.blocks.settings;
        this.settings.dimensions = this.data.blocks.dimensions;
        this.settings.currency = this.data.blocks.settings.currency;

        this.settings.locale = this.data.blocks.locale;

        if (this.data.blocks.languages) {
          this.settings.languages = Object.keys(this.data.blocks.languages).map(i => this.data.blocks.languages[i]);
        }
        this.settings.currencies = this.data.blocks.currencies;
        this.settings.calc(this.platform.width());
        if (this.settings.colWidthLatest == 4) {
          this.filter.per_page = 15;
        }
        //this.settings.theme = this.data.blocks.theme;
        this.splashScreen.hide();
      }, error => console.error(error));
      this.getPosts();
    });

    window.addEventListener('app:update', (e: any) => {
      this.getBlocks();
    });

  }

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      this.getPosts();
    });
  }

  getEvents() {
    this.api.get('/mec-events', 'Getting Events', true).then(res => {
      this.mobileEvents = [];
      for (let event of res) {
        for (let category of event.mec_category) {
          if (category.name === 'Mobile') {
            this.mobileEvents.push(event);
          }
        }
      }
      if (this.mobileEvents.length == 0) {
        this.events = res.slice(0, 2);
      } else {
        this.events = this.mobileEvents;
      }

      console.log(this.events);
    }, err => {
    });
  }

  getCart() {
    this.api.postItem('cart').then(res => {
      this.cart = res;
      this.data.updateCart(this.cart.cart_contents);
      this.data.cartNonce = this.cart.cart_nonce;
    }, err => {
      console.log(err);
    });
  }

  async getLocation() {
    const modal = await this.modalCtrl.create({
      component: LocationPage,
      componentProps: {
        path: 'tabs/home'
      },
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl,
    });
    modal.present();
    const {data} = await modal.onWillDismiss();
    if (data && data.update) {
      this.loading = true;
      this.filter.page = 1;
      this.getBlocks();
      console.log(this.api.userLocation);
      this.storage.set('userLocation', this.api.userLocation);
    }
  }

  getDetail(post) {
    this.post.post = post;
    this.navCtrl.navigateForward('/tabs/account/blogs/blog/' + post.id + '/home');
  }

  getBlocks() {

    this.api.postItem('keys').then(res => {
      this.loading = false;
      this.data.blocks = res;
      console.log('Data BLOCKS::::', this.data.blocks);
      for (let block of this.data.blocks.blocks) {
        this.sliders[block.style] = block;
        console.log('BLOCK::', block);
        this.sliders[block.style]['items'] = [];
        for (let child in block.children) {
          if (block.children.hasOwnProperty(child)) {
            console.log('CHILD::::', child);
            console.log('CHILDREN::::', block.children[child]);
            this.sliders[block.style]['items'].push(block.children[child]);
          }
        }
      }
      console.log('SLIDERS', this.sliders);
      if (this.data.blocks && this.data.blocks.user) {
        this.settings.user = this.data.blocks.user.data;
      }

      if (this.settings.settings.location_filter == 1 && this.api.userLocation.latitude == 0) {
        this.getLocation();
      }
      //this.settings.theme = this.data.blocks.theme;
      this.settings.locale = this.data.blocks.locale;

      this.settings.pages = this.data.blocks.pages;
      if (this.data.blocks.user) {
        this.settings.reward = this.data.blocks.user.data.points_vlaue;
      }
      if (this.data.blocks.languages) {
        this.settings.languages = Object.keys(this.data.blocks.languages).map(i => this.data.blocks.languages[i]);
      }
      this.settings.currencies = this.data.blocks.currencies;
      this.settings.settings = this.data.blocks.settings;
      this.settings.dimensions = this.data.blocks.dimensions;
      this.settings.currency = this.data.blocks.settings.currency;
      if (this.data.blocks.categories) {
        this.data.categories = this.data.blocks.categories.filter(item => item.name != 'Uncategorized');
        this.data.mainCategories = this.data.categories.filter(item => item.parent == 0);
      }
      this.settings.calc(this.platform.width());
      if (this.settings.colWidthLatest == 4) {
        this.filter.per_page = 15;
      }
      this.splashScreen.hide();
      this.getCart();
      this.processOnsignal();
      if (this.data.blocks.user) {
        this.settings.customer.id = this.data.blocks.user.ID;
        if (this.data.blocks.user.wc_product_vendors_admin_vendor || this.data.blocks.user.allcaps.dc_vendor || this.data.blocks.user.allcaps.seller || this.data.blocks.user.allcaps.wcfm_vendor) {
          this.settings.vendor = true;
        }
        if (this.data.blocks.user.allcaps.administrator) {
          this.settings.administrator = true;
        }
      }
      for (let item in this.data.blocks.blocks) {
        var filter;
        if (this.data.blocks.blocks[item].block_type == 'flash_sale_block') {
          this.data.blocks.blocks[item].interval = setInterval(() => {
            var countDownDate = new Date(this.data.blocks.blocks[item].sale_ends).getTime();
            var now = new Date().getTime();
            var distance = countDownDate - now;
            this.data.blocks.blocks[item].days = Math.floor(distance / (1000 * 60 * 60 * 24));
            this.data.blocks.blocks[item].hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            this.data.blocks.blocks[item].minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            this.data.blocks.blocks[item].seconds = Math.floor((distance % (1000 * 60)) / 1000);
            if (distance < 0) {
              clearInterval(this.data.blocks.blocks[item].interval);
              this.data.blocks.blocks[item].hide = true;
            }
          }, 1000);
        }
      }
      if (this.data.blocks.settings.show_latest) {
        this.data.products = this.data.blocks.recentProducts;
      }
      if (this.data.blocks.user) {
        this.api.postItem('get_wishlist').then(res => {
          this.get_wishlist = res;
          for (let item in this.get_wishlist) {
            this.settings.wishlist[this.get_wishlist [item].id] = this.get_wishlist [item].id;
          }
        }, err => {
          console.log(err);
        });
      }

      this.nativeStorage.setItem('blocks', {
        blocks: this.data.blocks,
        categories: this.data.categories
      }).then(
        () => console.log('Stored item!'), error => console.error('Error storing item', error));

      /* Product Addons */
      if (this.data.blocks.settings.switchAddons) {
        this.api.getAddonsList('product-add-ons').then(res => {
          this.settings.addons = res;
        });
      }
    }, err => {
      console.log(err);
    });
  }

  goto(item) {
    if (item.description == 'category') {
      this.navCtrl.navigateForward('/tabs/home/products/' + item.url);
    } else if (item.description == 'stores') {
      let navigationExtras = {
        queryParams: {
          item: JSON.stringify(item),
        }
      };
      this.navCtrl.navigateForward('/tabs/home/stores', navigationExtras);
    } else if (item.description == 'product') {
      this.navCtrl.navigateForward('/tabs/home/product/' + item.url);
    } else if (item.description == 'post') {
      this.navCtrl.navigateForward('/tabs/home/post/' + item.url);
    }
  }

  getProduct(item) {
    this.product.product = item;
    this.navCtrl.navigateForward('/tabs/home/product/' + item.id);
  }

  getSubCategories(id) {
    const results = this.data.categories.filter(item => item.parent === parseInt(id));
    return results;
  }

  getCategory(id) {
    this.navCtrl.navigateForward('/tabs/home/products/' + id);
  }

  loadData(event) {
    this.filter.page = this.filter.page + 1;
    this.api.postItem('products', this.filter).then(res => {
      this.tempProducts = res;
      this.data.products.push.apply(this.data.products, this.tempProducts);
      event.target.complete();
      if (this.tempProducts.length == 0) {
        this.hasMoreItems = false;
      }
    }, err => {
      event.target.complete();
    });
  }

  async getPosts(post = 'posts') {
    await this.api.getPosts('/wp-json/wp/v2/' + post + '?_embed&per_page=10&categories=45&page=' + this.filter.page).then(res => {
      if (res) {
        this.posts = res;
      } else {
        this.posts.posts = [];
      }
    }, err => {
      console.log(err);
    });
  }

  processOnsignal() {
    this.oneSignal.startInit(this.data.blocks.settings.onesignal_app_id, this.data.blocks.settings.google_project_id);
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
    this.oneSignal.handleNotificationReceived().subscribe(() => {
      //do something when notification is received
    });
    this.oneSignal.handleNotificationOpened().subscribe(result => {
      if (result.notification.payload.additionalData.category) {
        this.navCtrl.navigateForward('/tabs/home/products/' + result.notification.payload.additionalData.category);
      } else if (result.notification.payload.additionalData.product) {
        this.navCtrl.navigateForward('/tabs/home/product/' + result.notification.payload.additionalData.product);
      } else if (result.notification.payload.additionalData.post) {
        this.navCtrl.navigateForward('/tabs/home/post/' + result.notification.payload.additionalData.post);
      } else if (result.notification.payload.additionalData.order) {
        this.navCtrl.navigateForward('/tabs/account/orders/order/' + result.notification.payload.additionalData.order);
      }
    });
    this.oneSignal.endInit();
  }

  doRefresh(event = null) {
    this.filter.page = 1;
    //this.getBlocks();
    this.getEvents();
    this.getBlocks();
    this.getPosts();
    if (event !== null) {
      setTimeout(() => {
        event.target.complete();
      }, 2000);
    }
  }

  getHeight(child) {
    return (child.height * this.screenWidth) / child.width;
  }

  async addToCart(product) {
    if (product.manage_stock && product.stock_quantity < this.data.cart[product.id]) {
      this.presentAlert(this.lan.message, this.lan.lowQuantity);
    } else if (product.type == 'variable' || product.type == 'grouped') {
      this.getProduct(product);
    } else if (this.setVariations(product)) {

      if (this.data.cart[product.id] != undefined) {
        this.data.cart[product.id] += 1;
      } else {
        this.data.cart[product.id] = 1;
      }

      this.options.product_id = product.id;
      await this.api.postItem('add_to_cart', this.options).then(res => {
        this.cart = res;
        this.data.updateCart(this.cart.cart);
      }, err => {
        console.log(err);
      });
    }
  }

  setVariations(product) {
    if (product.variationId) {
      this.options.variation_id = product.variationId;
    }
    product.attributes.forEach(item => {
      if (item.selected) {
        this.options['variation[attribute_pa_' + item.name + ']'] = item.selected;
      }
    });
    for (var i = 0; i < product.attributes.length; i++) {
      if (product.type == 'variable' && product.attributes[i].variation && product.attributes[i].selected == undefined) {
        this.presentAlert(this.lan.options, this.lan.select + ' ' + product.attributes[i].name + ' ' + this.lan.option);
        return false;
      }
    }
    return true;
  }

  async presentAlert(header, message) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async updateToCart(product) {
    var params: any = {};
    if (product.manage_stock && product.stock_quantity < this.data.cart[product.id]) {
      this.presentAlert(this.lan.message, this.lan.lowQuantity);
    } else {
      for (let key in this.data.cartItem) {
        if (this.data.cartItem[key].product_id == product.id) {
          if (this.data.cartItem[key].quantity != undefined && this.data.cartItem[key].quantity == 0) {
            this.data.cartItem[key].quantity = 0;
          } else {
            this.data.cartItem[key].quantity += 1;
          }
          ;
          if (this.data.cart[product.id] != undefined && this.data.cart[product.id] == 0) {
            this.data.cart[product.id] = 0;
          } else {
            this.data.cart[product.id] += 1;
          }
          ;
          params.key = key;
          params.quantity = this.data.cartItem[key].quantity;
        }
      }
      params.update_cart = 'Update Cart';
      params._wpnonce = this.data.cartNonce;
      await this.api.postItem('update-cart-item-qty', params).then(res => {
        this.cart = res;
        this.data.updateCart(this.cart.cart_contents);
      }, err => {
        console.log(err);
      });

    }

  }

  async deleteFromCart(product) {
    var params: any = {};
    for (let key in this.data.cartItem) {
      if (this.data.cartItem[key].product_id == product.id) {
        if (this.data.cartItem[key].quantity != undefined && this.data.cartItem[key].quantity == 0) {
          this.data.cartItem[key].quantity = 0;
        } else {
          this.data.cartItem[key].quantity -= 1;
        }
        ;
        if (this.data.cart[product.id] != undefined && this.data.cart[product.id] == 0) {
          this.data.cart[product.id] = 0;
        } else {
          this.data.cart[product.id] -= 1;
        }
        ;
        params.key = key;
        params.quantity = this.data.cartItem[key].quantity;
      }
    }
    params.update_cart = 'Update Cart';
    params._wpnonce = this.data.cartNonce;
    await this.api.postItem('update-cart-item-qty', params).then(res => {
      console.log(res);
      this.cart = res;
      this.data.updateCart(this.cart.cart_contents);
    }, err => {
      console.log(err);
    });
  }

  openLink(url) {
    this.iab.create(url, '_system', this.option);

  }

  stringfy(text: any) {
    return JSON.stringify(text);
  }

  open(link: string) {
    window.open(link);
  }
}

import {Injectable} from '@angular/core';
import {Headers, URLSearchParams} from '@angular/http';

declare var oauthSignature: any;
const headers = new Headers();
headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');


@Injectable({
  providedIn: 'root',
})
export class Config {

  url: any;
  consumerKey: any;
  consumerSecret: any;
  avatar: any = 'assets/image/shop-icon.jpg';
  oauth: any;
  signedUrl: any;
  randomString: any;
  // tslint:disable-next-line:variable-name
  oauth_nonce: any;
  // tslint:disable-next-line:variable-name
  oauth_signature_method: any;
  encodedSignature: any;
  searchParams: any;
  // tslint:disable-next-line:variable-name
  customer_id: any;
  params: any;
  options: any = {};
  optionstwo: any = {};
  lang: any = 'en';

  constructor() {

    this.url = 'https://www.holylifeministriesint.org';
    this.consumerKey = 'ck_4cf95f750c1189672ac8d197764b5818169108bf';
    this.consumerSecret = 'cs_a489d05987aa0da37541fa3a8c47dc1aba1c8027';

    this.options.withCredentials = true;
    this.options.headers = {};
    this.optionstwo.withCredentials = false;
    this.optionstwo.headers = {};
    this.oauth = oauthSignature;
    this.oauth_signature_method = 'HMAC-SHA1';
    this.searchParams = new URLSearchParams();
    this.params = {};
    this.params.oauth_consumer_key = this.consumerKey;
    this.params.oauth_signature_method = 'HMAC-SHA1';
    this.params.oauth_version = '1.0';
  }

  setOauthNonce(length, chars) {
    let result = '';
    for (let i = length; i > 0; --i) {
      result += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return result;
  }

  setUrl(method, endpoint, filter) {
    let key;
    let unordered = {
      consumer_key: undefined,
      consumer_secret: undefined,
      lang: undefined
    };
    const ordered = {};
    if (this.url.indexOf('https') >= 0) {
      // @ts-ignore
      unordered = {};
      if (filter) {
        // tslint:disable-next-line:forin
        for (key in filter) {
          unordered[key] = filter[key];
        }
      }
      unordered.consumer_key = this.consumerKey;
      unordered.consumer_secret = this.consumerSecret;
      unordered.lang = this.lang;
      // tslint:disable-next-line:only-arrow-functions
      Object.keys(unordered).sort().forEach(function(key) {
        ordered[key] = unordered[key];
      });
      this.searchParams = new URLSearchParams();
      // tslint:disable-next-line:forin
      for (key in ordered) {
        this.searchParams.set(key, ordered[key]);
      }
      return this.url + '/wp-json/wc/v3/' + endpoint + this.searchParams.toString();
    } else {
      const url = this.url + '/wp-json/wc/v3/' + endpoint;
      this.params.oauth_consumer_key = this.consumerKey;
      this.params.oauth_nonce = this.setOauthNonce(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
      this.params.oauth_timestamp = new Date().getTime() / 1000;
      // tslint:disable-next-line:forin
      for (key in this.params) {
        unordered[key] = this.params[key];
      }
      if (filter) {
        // tslint:disable-next-line:forin
        for (key in filter) {
          unordered[key] = filter[key];
        }
      }
      unordered.lang = this.lang;
      // tslint:disable-next-line:only-arrow-functions
      Object.keys(unordered).sort().forEach(function(key) {
        ordered[key] = unordered[key];
      });
      this.searchParams = new URLSearchParams();
      // tslint:disable-next-line:forin
      for (key in ordered) {
        this.searchParams.set(key, ordered[key]);
      }
      this.encodedSignature = this.oauth.generate(method, url, this.searchParams.toString(), this.consumerSecret);
      return this.url + '/wp-json/wc/v3/' + endpoint + this.searchParams.toString() + '&oauth_signature=' + this.encodedSignature;
    }
  }

  setUrlNew(method, endpoint, filter) {
    let key;
    let unordered = {
      consumer_key: undefined,
      consumer_secret: undefined,
      lang: undefined
    };
    const ordered = {};
    if (this.url.indexOf('https') >= 0) {
      // @ts-ignore
      unordered = {};
      if (filter) {
        // tslint:disable-next-line:forin
        for (key in filter) {
          unordered[key] = filter[key];
        }
      }
      unordered.consumer_key = this.consumerKey;
      unordered.consumer_secret = this.consumerSecret;
      unordered.lang = this.lang;
      // tslint:disable-next-line:only-arrow-functions
      Object.keys(unordered).sort().forEach(function(key) {
        ordered[key] = unordered[key];
      });
      this.searchParams = new URLSearchParams();
      // tslint:disable-next-line:forin
      for (key in ordered) {
        this.searchParams.set(key, ordered[key]);
      }
      return this.url + '/wp-json/wp/v2/' + endpoint + this.searchParams.toString();
    } else {
      const url = this.url + '/wp-json/wp/v2/' + endpoint;
      this.params.oauth_consumer_key = this.consumerKey;
      this.params.oauth_nonce = this.setOauthNonce(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
      this.params.oauth_timestamp = new Date().getTime() / 1000;
      // tslint:disable-next-line:forin
      for (key in this.params) {
        unordered[key] = this.params[key];
      }
      if (filter) {
        // tslint:disable-next-line:forin
        for (key in filter) {
          unordered[key] = filter[key];
        }
      }
      unordered.lang = this.lang;
      // tslint:disable-next-line:only-arrow-functions
      Object.keys(unordered).sort().forEach(function(key) {
        ordered[key] = unordered[key];
      });
      this.searchParams = new URLSearchParams();
      // tslint:disable-next-line:forin
      for (key in ordered) {
        this.searchParams.set(key, ordered[key]);
      }
      this.encodedSignature = this.oauth.generate(method, url, this.searchParams.toString(), this.consumerSecret);
      return this.url + '/wp-json/wp/v2/' + endpoint + this.searchParams.toString() + '&oauth_signature=' + this.encodedSignature;
    }
  }
}

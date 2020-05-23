import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Headers } from '@angular/http';

declare var oauthSignature: any;
var headers = new Headers();
headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');


@Injectable({
  providedIn: 'root',
})
export class Config {

    url: any;
    consumerKey: any;
    consumerSecret: any;
    avatar: any = "assets/image/shop-icon.jpg";
    oauth: any;
    signedUrl: any;
    randomString: any;
    oauth_nonce: any;
    oauth_signature_method: any;
    encodedSignature: any;
    searchParams: any;
    customer_id: any;
    params: any;
    options: any = {};
    optionstwo: any = {};
    lang: any = 'en';
    constructor() {

        /*this.url = 'https://www.yourorder.org/';
        this.consumerKey = 'ck_76ba7df193fcded01b56d8c76890af3df62da1b5';
        this.consumerSecret = 'cs_9ac396901c40eaf109344be2dd818ef9f0a78acc';

        this.url = 'https://savekeys.net';
        this.consumerKey = 'ck_8c369f5f3ecf3437c902066fef1a7eca623184b0';
        this.consumerSecret = 'cs_0ca7798c7a763c4c5601ddaaffe1aeb03f3f72b5';

        this.url = 'http://veganic.co.in';
        this.consumerKey = 'ck_5b3ae592290007399c12c378ac802b2ab276f8eb';
        this.consumerSecret = 'cs_f6d646efbdb167ad248e3db1edf48d0a9f92f14a';

        this.url = 'https://www.sallah.app';
        this.consumerKey = 'ck_ad89c5263fc12afe9b5d86b496d85b83d29904fe';
        this.consumerSecret = 'cs_855149c6a9d0ebc8c86e590277207f6629e0ea0b';

        this.url = 'https://www.yourorder.org';
        this.consumerKey = 'ck_76ba7df193fcded01b56d8c76890af3df62da1b5';
        this.consumerSecret = 'cs_9ac396901c40eaf109344be2dd818ef9f0a78acc';

        this.url = 'http://veganic.co.in';
        this.consumerKey = 'ck_5b3ae592290007399c12c378ac802b2ab276f8eb';
        this.consumerSecret = 'cs_f6d646efbdb167ad248e3db1edf48d0a9f92f14a';

        this.url = 'https://dadosh.com';
        this.consumerKey = 'ck_29d2b1801b13b9be0d2a05e68d3634792162c474';
        this.consumerSecret = 'cs_c12c5406cc9ab3211499a4fa3af748f0d8d4831c';
        /* for demo */

        this.url = 'http://35.226.27.186/woogrocery';
        this.consumerKey = 'ck_e00a94b5f205874348991e06cf6414ff55cfbf33';
        this.consumerSecret = 'cs_615eac5a998d3fb4b914bd66f80cf4c46777731d';

        this.url = 'https://www.yourorder.org';
        this.consumerKey = 'ck_76ba7df193fcded01b56d8c76890af3df62da1b5';
        this.consumerSecret = 'cs_9ac396901c40eaf109344be2dd818ef9f0a78acc';

        this.url = 'https://shop.embizo.co.za';
        this.consumerKey = 'ck_b0cd091aa9393bd71a9e1b78cc5f43b06bbec52d';
        this.consumerSecret = 'cs_3568ea04ec66acbfe04631c9b5032bae9fe62edb';

        this.url = 'https://cleanever.shop';
        this.consumerKey = 'ck_b3f3e2de646ed7eccfc828b90522c74f90f854ae';
        this.consumerSecret = 'cs_7dd96bd4f2b683ff14d5127d7590a7d1f1e1336c';

        this.url = 'https://www.ibmcbooks.lk';
        this.consumerKey = 'ck_9712feda2605b15d0e521ae5b93f106365ca0efc';
        this.consumerSecret = 'cs_7a4e4fb5ea0f54c7c14130b36c8504f11b549ee9';

        this.url = 'https://ecommerce.isi.ae';
        this.consumerKey = 'ck_d493259e5a9dfe3628a124a43cc9b03d23e20811';
        this.consumerSecret = 'cs_98fb5abbbd49b7628ff29a6c331c80b24b3806b8';

        this.url = 'https://testing.fugu.ec/tienda';
        this.consumerKey = 'ck_d75b3779847e2e422e2a632c96b548b2ce334bc1';
        this.consumerSecret = 'cs_cf6d2859507d93f98ae7baa8a0fa18f94895eb60';

        this.url = 'https://testing.fugu.ec/tienda';
        this.consumerKey = 'ck_d75b3779847e2e422e2a632c96b548b2ce334bc1';
        this.consumerSecret = 'cs_cf6d2859507d93f98ae7baa8a0fa18f94895eb60';

        this.url = 'http://35.226.27.186/woogrocery';
        this.consumerKey = 'ck_e00a94b5f205874348991e06cf6414ff55cfbf33';
        this.consumerSecret = 'cs_615eac5a998d3fb4b914bd66f80cf4c46777731d';

        this.url = 'http://localhost:8888/wcfm';
        this.consumerKey = 'ck_4a73578d64d0d3f996d69603590c9754b5aab15b';
        this.consumerSecret = 'cs_d8486ede4990b0edbb6d850d3845b2b0e26d1410';

        //this.url = 'https://hindbazar.in';
        //this.consumerKey = 'ck_45d30d1d88e4a30b93db55ecd9dadf67edde32ea';
        //this.consumerSecret = 'cs_dbcb90fc2f3e385112ec8ab2427be78955a8fa34';

        this.url = 'http://35.226.27.186/woogrocery';
        this.consumerKey = 'ck_e00a94b5f205874348991e06cf6414ff55cfbf33';
        this.consumerSecret = 'cs_615eac5a998d3fb4b914bd66f80cf4c46777731d';

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
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    }
    setUrl(method, endpoint, filter) {
        var key;
        var unordered = {};
        var ordered = {};
        if (this.url.indexOf('https') >= 0) {
            unordered = {};
            if (filter) {
                for (key in filter) {
                    unordered[key] = filter[key];
                }
            }
            unordered['consumer_key'] = this.consumerKey;
            unordered['consumer_secret'] = this.consumerSecret;
            unordered['lang'] = this.lang;
            Object.keys(unordered).sort().forEach(function(key) {
                ordered[key] = unordered[key];
            });
            this.searchParams = new URLSearchParams();
            for (key in ordered) {
                this.searchParams.set(key, ordered[key]);
            }
            return this.url + '/wp-json/wc/v3/' + endpoint + this.searchParams.toString();
        }
        else {
            var url = this.url + '/wp-json/wc/v3/' + endpoint;
            this.params['oauth_consumer_key'] = this.consumerKey;
            this.params['oauth_nonce'] = this.setOauthNonce(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
            this.params['oauth_timestamp'] = new Date().getTime() / 1000;
            for (key in this.params) {
                unordered[key] = this.params[key];
            }
            if (filter) {
                for (key in filter) {
                    unordered[key] = filter[key];
                }
            }
            unordered['lang'] = this.lang;
            Object.keys(unordered).sort().forEach(function(key) {
                ordered[key] = unordered[key];
            });
            this.searchParams = new URLSearchParams();
            for (key in ordered) {
                this.searchParams.set(key, ordered[key]);
            }
            this.encodedSignature = this.oauth.generate(method, url, this.searchParams.toString(), this.consumerSecret);
            return this.url + '/wp-json/wc/v3/' + endpoint + this.searchParams.toString() + '&oauth_signature=' + this.encodedSignature;
        }
    }
}
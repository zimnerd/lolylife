import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class YtService {
  apiKey = 'AIzaSyCFzxhusAXpBUeczr0hgkCsm9yLruMiE_w';
  yt = 'https://www.googleapis.com/youtube/v3';

  constructor(public http: HttpClient) {
  }

  async get(endpoint): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(this.yt + endpoint
      ).subscribe(res => {
        resolve(res);
      }, (err) => {
        console.log('ERROR ', endpoint, err);
        reject(err);
      });
    });
  }

}

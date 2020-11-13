import {Component, OnInit} from '@angular/core';
import {NavParams, Platform} from '@ionic/angular';
import {YoutubeVideoPlayer} from '@ionic-native/youtube-video-player/ngx';
import {YtService} from '../../yt.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.page.html',
  styleUrls: ['./playlist.page.scss'],
})
export class PlaylistPage implements OnInit {
  videos: any;
  apiKey = 'AIzaSyCFzxhusAXpBUeczr0hgkCsm9yLruMiE_w';
  listId;

  constructor(private navParams: NavParams, private yt: YtService, private youtube: YoutubeVideoPlayer, private plt: Platform) {
    this.listId = this.navParams.get('id');
  }

  ngOnInit() {
  }

  openVideo(video) {
    if (this.plt.is('cordova')) {
      this.youtube.openVideo(video.snippet.resourceId.videoId);
    } else {
      window.open('https://www.youtube.com/watch?v=' + video.snippet.resourceId.videoId);
    }
  }


  getListVideos() {
    this.yt.get('/playlistItems?key=' + this.apiKey + '&playlistId=' + this.listId + '&part=snippet,id&maxResults=20').then((playlist) => {
      console.log(playlist);
      this.videos = playlist;
    }).catch((err) => {
      console.log('Error::', err);
    });
  }



}

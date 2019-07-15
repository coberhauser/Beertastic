import { Component } from '@angular/core';
import { Platform, ToastController, LoadingController, NavController } from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation
} from '@ionic-native/google-maps';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  map: GoogleMap;
  loading: any;
  dataReturned: any;
  userId: any;

  constructor(public loadingCtrl: LoadingController,
    public toastCtrl: ToastController, private platform: Platform, public navController: NavController
    , private oneSignal: OneSignal) { }

  async ngOnInit() {
    // Since ngOnInit() is executed before `deviceready` event,
    // you have to wait the event.
    await this.platform.ready();
    await this.loadMap();
    this.oneSignal.getIds()
    .then(res => {
      this.userId = res.userId;
    })
    .catch(err =>
      alert(err)
    );
  }

  public gotoSettings() {
    this.navController.navigateForward('/settings');
  }

  loadMap() {
    this.map = GoogleMaps.create('map_canvas', {
      camera: {
        target: {
          lat: 48.139570,
          lng: 11.542291
        },
        zoom: 18,
        tilt: 30
      }
    });

  }

  async locateMe() {
    this.map.clear();

    this.loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    await this.loading.present();

    // Get the location of you
    this.map.getMyLocation().then((location: MyLocation) => {
      this.loading.dismiss();
      console.log(JSON.stringify(location, null, 2));


      this.sendNotification(location);


      // Move the map camera to the location with animation
      this.map.animateCamera({
        target: location.latLng,
        zoom: 17,
        tilt: 30
      });

      // add a marker
      let marker: Marker = this.map.addMarkerSync({
        title: 'Beertastic!',
        snippet: 'I drink here!',
        position: location.latLng,
        animation: GoogleMapsAnimation.BOUNCE
      });

      // show the infoWindow
      marker.showInfoWindow();

      // If clicked it, display the alert
      marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        this.showToast('clicked!');
      });
    })
      .catch(err => {
        this.loading.dismiss();
        this.showToast(err.error_message);
      });
  }

  async showToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });

    toast.present();
  }

  async drink() {
    this.locateMe();
  }

  async sendNotification(location) {
    var notificationObj = {
      app_id: "2821b854-cfa7-4bc4-9e20-57ef25c046de",
      include_player_ids: [this.userId],
      data: { latitude: location.latitude, long: location.long },
      headings: { en: 'Obi says:' },
      contents: { en: "I drink here" }
    };

    this.oneSignal.postNotification(notificationObj)
      .then(res => {
        console.log("Notification Post Success:", res);
      })
      .catch(err => {
        console.log("Notification Post Failed: ", err);
        alert("Notification Post Failed:\n" + JSON.stringify(err));
      });

  }

  GoToList() {
    this.navController.navigateForward('/modal');
  }

  BackToList() {
    this.navController.navigateBack('');
  }

  // add tags to users
  sendTags(key, value) {
    this.oneSignal.sendTags({ key: value });
  }

}


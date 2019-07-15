import { Component } from "@angular/core";
import {
  BarcodeScannerOptions,
  BarcodeScanner
} from "@ionic-native/barcode-scanner/ngx";
import { Platform, ToastController } from '@ionic/angular';
import { Contacts, Contact } from '@ionic-native/contacts/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { OneSignal } from '@ionic-native/onesignal/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  encodedData: {};
  scannedData: {};
  barcodeScannerOptions: BarcodeScannerOptions;
  people: any[] = [];
  userId: any;

  constructor(private barcodeScanner: BarcodeScanner, private contacts: Contacts, private platform: Platform, private socialSharing: SocialSharing,
    private alertController: AlertController,
    public toastCtrl: ToastController,
    private oneSignal: OneSignal,
    private storage: Storage) {
    this.platform.ready().then((readySource) => {
      console.log('Platform ready from', readySource);
    });
    //Options
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };
  }

  async presentAlert(_message) {
    this.presentAlert2('Error', _message);
  }

  async presentAlert2(_title, _message) {
    const alert = await this.alertController.create({
      header: _title,
      message: _message,
      buttons: ['OK']
    });
    await alert.present();
  }

  pickContact(): void {
    this.contacts.pickContact()
      .then((response: Contact) => {
        console.log(response);
        this.addContact(response);
      }).catch((err) => {
        console.error('Error saving contact.', err);
      });
  }

  ngAfterViewInit() {
    // checking if there's something saved, then...
    if (this.storage.get('friendsdata')) {
      this.storage.get('friendsdata').then((data) => {
        console.log('Your friendsdata is ', data);
        this.people = data;
      });
    };
    this.oneSignal.getIds()
      .then(res => {
        this.userId = res.userId;
      })
      .catch(err =>
        alert(err)
      );
  }

  addContact(contact: Contact) {
    console.log('Contact added ' + contact);
    if (this.people == null) {
      this.people = [];
    }
    this.people.push({ name: contact.name.formatted, properties: { status: 'from phone', alias: contact.nickname } });
    this.storage.set('friendsdata', this.people);
  }

  addTest() {
    if (this.people == null) {
      this.people = [];
    }
    this.people.push({ name: 'Nice McNicenstein', properties: { status: 'debugging', alias: 'Beerio' } });
    this.storage.set('friendsdata', this.people);
  }

  remove(person: any) {
    for (var i = 0; i < this.people.length; i++) {
      if (this.people[i] === person) {
        this.people.splice(i, 1);
      }
    }
    console.log('Your friendsdata is ', this.people);
    this.storage.set('friendsdata', this.people);
  }

  reset() {
    this.people = [];
    this.storage.set('friendsdata', this.people);
  }

  async shareWithOptions() {
    let options = {
      message: 'Join me @ Beertastic', // not supported on some apps (Facebook, Instagram)
      subject: 'Beertastic', // fi. for email
      files: [], // an array of filenames either locally or remotely
      url: 'https://github.com/coberhauser/Beertastic',
      chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
    }

    // Image or URL works
    this.socialSharing.shareWithOptions(options).then((result) => {
      console.log("Share completed? ", result.completed); // On Android apps mostly return false even while it's true
      console.log("Shared to app: ", result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false
    }).catch((err) => {
      this.presentAlert('Social sharing is not available');
      console.log("Sharing failed with message: ", err);
    });
  }

  scanCode() {
    this.barcodeScanner
      .scan()
      .then(barcodeData => {
        this.showToast(JSON.stringify(barcodeData));
        this.scannedData = barcodeData;
      })
      .catch(err => {
        this.presentAlert('Barcode Scan is not available');
        console.log("Error", err);
      });
  }

  encodedText() {
    if (this.storage.get('userdata')) {
      this.storage.get('userdata').then((data) => {
        console.log('Your userdata is ', data);
        var encodeThis = data['email'];
        this.barcodeScanner
          .encode(this.barcodeScanner.Encode.TEXT_TYPE, encodeThis)
          .then(
            encodedData => {
              console.log(encodedData);
              this.encodedData = encodedData;
            },
            err => {
              this.presentAlert('Barcode encode is not available');
              console.log("Error occured : " + err);
            }
          );
      });
    };

  }

  drink(buddyname) {
    this.showToast('Drink, ' + buddyname + '!');
  }

  prost(buddyname) {
    this.showToast('Prost, ' + buddyname + '!');
  }

  join(buddyname) {
    this.showToast('Join me drinking, ' + buddyname + '.');
  }

  async showToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });

    toast.present();
  }

  sendNotification() {
    var notificationObj = {
      app_id: "2821b854-cfa7-4bc4-9e20-57ef25c046de",
      include_player_ids: [this.userId],
      data: { data_key: "data_value", openURL: "https://imgur.com/" },
      headings: { en: 'Prost' },
      contents: { en: "Dude!" },
      buttons: [{"id": "like-button", "text": "Like", "icon": "http://i.imgur.com/N8SN8ZS.png", "url": "https://yoursite.com"}, {"id": "read-more-button", "text": "Read more", "icon": "http://i.imgur.com/MIxJp1L.png", "url": "https://yoursite.com"}]
    };

    this.oneSignal.postNotification(notificationObj)
      .then(res =>
        console.log("Notification Post Success:", res))
      .catch(err => {
        console.log("Notification Post Failed: ", err);
        alert("Notification Post Failed:\n" + JSON.stringify(err));
      });

  }

}

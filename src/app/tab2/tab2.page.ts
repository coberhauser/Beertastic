import { Component } from "@angular/core";
import {
  BarcodeScannerOptions,
  BarcodeScanner
} from "@ionic-native/barcode-scanner/ngx";
import { Platform } from '@ionic/angular';
import { Contacts, Contact } from '@ionic-native/contacts/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  encodeData: any;
  scannedData: {};
  barcodeScannerOptions: BarcodeScannerOptions;

  constructor(private barcodeScanner: BarcodeScanner, private contacts: Contacts, private plt: Platform, private socialSharing: SocialSharing, public alertController: AlertController) {
    this.plt.ready().then((readySource) => {
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
        console.log(response)
      }).catch((err) => {
        this.presentAlert('Contacts are not available');
        console.error('Error saving contact.', err)
      });
  }


  async shareWithOptions() {
    let options = {
      message: 'Join me @ Beertastic', // not supported on some apps (Facebook, Instagram)
      subject: 'Beertastic', // fi. for email
      files: ['', ''], // an array of filenames either locally or remotely
      url: 'https://example.com/',
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
        alert("Barcode data " + JSON.stringify(barcodeData));
        this.scannedData = barcodeData;
      })
      .catch(err => {
        this.presentAlert('Barcode Scan is not available');
        console.log("Error", err);
      });
  }

  encodedText() {
    this.barcodeScanner
      .encode(this.barcodeScanner.Encode.TEXT_TYPE, this.encodeData)
      .then(
        encodedData => {
          console.log(encodedData);
          this.encodeData = encodedData;
        },
        err => {
          this.presentAlert('Barcode encode is not available');
          console.log("Error occured : " + err);
        }
      );
  }

  drink(buddyname) {
    this.presentAlert2(buddyname, 'Drink with me!')
  }

  prost(buddyname) {
    this.presentAlert2(buddyname, 'Prost!')
  }

}

import { Component } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { AppLauncher, AppLauncherOptions } from '@ionic-native/app-launcher';
import { Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Contacts, Contact } from '@ionic-native/contacts/ngx';

@Component({
  selector: 'app-tab5',
  templateUrl: 'tab5.page.html',
  styleUrls: ['tab5.page.scss']

})
export class Tab5Page {

  constructor(private callNumber: CallNumber, private contacts: Contacts, private platform: Platform, public alertController: AlertController) {
    this.platform.ready().then((readySource) => {
      console.log('Platform ready from', readySource);
    });

  }

  async presentAlert(_message) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: _message,
      buttons: ['OK']
    });
    await alert.present();
  }

  launchFreeNow() {
    this.launch('ios dead', 'taxi.android.client');
  }

  launchUber() {
    this.launch('ios dead', 'com.ubercab');
  }

  launchMvg() {
    this.launch('ios dead', 'de.swm.mvgfahrinfo.muenchen');
  }

  launchDb() {
    this.launch('ios dead', 'de.hafas.android.db');
  }

  launch(uri, packagename) {
    AppLauncher.canLaunch({ packageName: packagename })
      .then((canLaunch: boolean) => {
        AppLauncher.launch({ packageName: packagename }).then(() => console.log(packagename + ' launched'))
          .catch((error: any) => console.error(packagename + ' cannot be launched'))
      })
      .catch((error: any) => {
        this.presentAlert(packagename + ' is not available');
        console.error(packagename + ' is not available')
      });
  }

  callNow(number) {
    this.callNumber.callNumber(number, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => {
        this.presentAlert('Dialer is not available');
        console.log('Error launching dialer', err)
      });
  }

  pickContact(): void {
    this.contacts.pickContact()
      .then((response: Contact) => {
        console.log(response);
        this.callNow(response.phoneNumbers[0].value);
      }).catch((err) => {
        console.error('Error calling contact.', err);
      });
  }
}

import { Component } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { AlertController, Platform, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public base64Image: string;

  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.DATA_URL,
    saveToPhotoAlbum: true,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true
  }

  constructor(public toastCtrl: ToastController, private camera: Camera, private alertController: AlertController, private platform: Platform) {
    this.platform.ready().then((readySource) => {
      console.log('Platform ready from', readySource);
    });
  }

  placeOrder() {
    this.showToast('Place order here');
  }

  async showToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });

    toast.present();
  }

  async takePic() {
    this.camera.getPicture(this.options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.base64Image = 'data:image/jpg;base64,' + imageData;     
    }, (err) => {
      // Handle error
      this.presentAlert(err);
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
}

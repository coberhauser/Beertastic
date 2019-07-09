import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private navController: NavController, private toastCtrl: ToastController) { }

  ngOnInit() {
  }

  goBack() {
    this.navController.back();
  }

  public gotoAbout() {
    this.navController.navigateForward('/about');
  }

  async showToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });

    toast.present();
  }


}

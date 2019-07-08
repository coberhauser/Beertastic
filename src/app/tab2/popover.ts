import { Component } from '@angular/core';
import { ModalController  } from '@ionic/angular';


@Component({
    template: `
      <ion-list>
        <ion-list-header>Ionic</ion-list-header>
        <button ion-item (click)="close()">Learn Ionic</button>
        <button ion-item (click)="close()">Documentation</button>
        <button ion-item (click)="close()">Showcase</button>
        <button ion-item (click)="close()">GitHub Repo</button>
      </ion-list>
    `
  })
  export class PopoverPage {
    constructor(public viewCtrl: ModalController) {}

    close() {
      this.viewCtrl.dismiss();
    }
  }
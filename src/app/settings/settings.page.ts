import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  validationsForm: FormGroup;
  submitted = false;

  constructor(private navController: NavController, private toastCtrl: ToastController, private formBuilder: FormBuilder, public storage: Storage) {

    this.validationsForm = this.formBuilder.group({
      alias: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });

    /* Check if form has been changed */
    this.validationsForm.valueChanges.subscribe(data =>
      this.storage.set('userdata', data)
    );

    let validation_messages = {
      'email': [
        { type: 'required', message: 'Email is required.' },
        { type: 'minlength', message: 'Email must be at least 5 characters long.' },
        { type: 'maxlength', message: 'Email cannot be more than 25 characters long.' },
        { type: 'pattern', message: 'Your username must contain a valid email adress.' },
      ],
      'alias': [
        { type: 'required', message: 'Alias is required.' },
        { type: 'error', message: 'Alias is required.' }
      ],

    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // checking if there's something saved, then...
    if (this.storage.get('userdata')) {
      this.storage.get('userdata').then((data) => {
        console.log('Your userdata is ', data);
        this.validationsForm.setValue(data);
      });
    }
  }

  goBack() {
    this.navController.back();
  }

  async showToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }

  get frm() { return this.validationsForm.controls; }

  onSubmit(value: any): void {
    this.submitted = true;

    // Stop if the form validation has failed
    if (this.validationsForm.invalid) {
      return;
    }
    this.storage.set('userdata', value);
    this.showToast('Saved');
    this.goBack();
  }
}

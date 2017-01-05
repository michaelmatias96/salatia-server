import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ChooseMeatPage} from "../choose-meat/choose-meat";

/*
  Generated class for the CreateOrderExtras page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-create-order-extras',
  templateUrl: 'create-order-extras.html'
})
export class CreateOrderExtrasPage {
  type: String;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.type = navParams.data.type;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateOrderExtrasPage');
  }

  public submitExtras() {
    this.navCtrl.push(ChooseMeatPage, {});
  }

}

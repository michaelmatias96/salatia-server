import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import {CreateOrderExtrasPage} from "../create-order-extras/create-order-extras";

/*
  Generated class for the CreateOrder page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-create-order',
  templateUrl: 'create-order.html'
})
export class CreateOrderPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateOrderPage');
  }

  public order(type: String) {
    this.navCtrl.push(CreateOrderExtrasPage, {
      type: type
    });
  }

}

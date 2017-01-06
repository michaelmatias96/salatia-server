import { Component } from '@angular/core';
import {NavController, NavParams, LoadingController} from 'ionic-angular';
import {OrderService} from "../../providers/order-service";
import {SubmitOrderPage} from "../submit-order/submit-order";

/*
  Generated class for the ChooseMeat page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-choose-meat',
  templateUrl: 'choose-meat.html'
})
export class ChooseMeatPage {
  meatDetails: Object;
  chosenMeat: String;
  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController, private orderService: OrderService) {
    this.meatDetails = orderService.meatDetails;
    this.chosenMeat = "";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChooseMeatPage');
  }

  continue() {
    this.presentLoading();
    this.orderService.setExtras(this.chosenMeat);
    this.navCtrl.push(SubmitOrderPage);
  }

  chooseMeat(meatId) {
    this.chosenMeat = meatId;
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Loading meat types...",
      duration: 500
    });
    loader.present();
  }
}

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
  chosenMeat: string;
  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController, private orderService: OrderService) {
    this.meatDetails = orderService.menuDetails['meatDetails'];
    orderService.menuDetailsChanged.subscribe(
      result => this.meatDetails = result.meatDetails
    );
    this.chosenMeat = null;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChooseMeatPage');
  }

  continue() {
    this.presentLoading();
    this.orderService.setMeat(this.chosenMeat);
    this.navCtrl.push(SubmitOrderPage);
  }

  chooseMeat(meatId) {
    this.chosenMeat = meatId;
  }

  getItemsInRowsCols(items) {
    var rows = [];
    var currentRow = [];
    for (var i = 0; i < items.length; i++) {
      currentRow.push(items[i]);
      if (i != 0 && (i+1) % 3 == 0) {
        rows.push(currentRow);
        currentRow = [];
      }
    }
    return rows;
  }

  getMeatClass(id) {
    if (this.chosenMeat == id) {
      return "checked";
    } else {
      return "unchecked";
    }
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Loading meat types...",
      duration: 500
    });
    loader.present();
  }
}

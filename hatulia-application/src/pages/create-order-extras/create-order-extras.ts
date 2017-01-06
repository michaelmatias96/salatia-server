import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ChooseMeatPage} from "../choose-meat/choose-meat";
import { OrderService } from '../../providers/order-service';
import { LoadingController } from 'ionic-angular';


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
  extrasDetails: Object;

  constructor(public navCtrl: NavController, private orderService: OrderService, private loadingCtrl: LoadingController) {
    console.log(orderService);
    this.extrasDetails = orderService.extrasDetails;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateOrderExtrasPage');
  }

  public submitExtras() {
    this.presentLoading();
    this.orderService.setExtras({});
    this.navCtrl.push(ChooseMeatPage);
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Loading meat types...",
      duration: 500
    });
    loader.present();
  }

}

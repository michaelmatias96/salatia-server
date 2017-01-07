import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { OrderService } from '../../providers/order-service';
import {CreateOrderExtrasPage} from "../create-order-extras/create-order-extras";
import { LoadingController } from 'ionic-angular';

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
  mealDetails: Object;
  constructor(public navCtrl: NavController, private auth: AuthService, private orderService: OrderService, public loadingCtrl: LoadingController) {
    console.log(orderService.order);
    this.mealDetails = orderService.mealDetails;
  }

  public getMealTitles() {
    return Object.keys(this.mealDetails);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateOrderPage');
  }

  public continue(mealId: String) {
    this.presentLoading();
    this.orderService.setMeal(mealId);
    this.navCtrl.push(CreateOrderExtrasPage);
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Loading extras...",
      duration: 500
    });
    loader.present();
  }
}

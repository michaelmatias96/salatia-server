import { Component } from '@angular/core';
import {OrderService, Order} from "../../providers/order-service";
import {ToastController, NavController} from 'ionic-angular';
import {ViewOrderPage} from "../view-order/view-order";

/*
  Generated class for the SubmitOrder page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-submit-order',
  templateUrl: 'submit-order.html'
})
export class SubmitOrderPage {
  finalOrder: Order;
  constructor(public toastCtrl: ToastController, public orderService: OrderService, public navCtrl: NavController) {
    this.finalOrder = new Order(orderService.order.mealType, orderService.order.extras, orderService.order.meatType);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubmitOrderPage');
  }

  submitOrder() {
    this.orderService.submitOrder(this.finalOrder)
      .subscribe(
        result => this.extractResults(result),
        error => alert(error)
      );
  }

  extractResults(result) {
    if (result.success == true) {
      let toast = this.toastCtrl.create({
        message: 'Order was sent!',
        duration: 3000
      });
      toast.present();
      this.navCtrl.push(ViewOrderPage);
    }
  }
}

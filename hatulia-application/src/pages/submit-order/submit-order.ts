import { Component } from '@angular/core';
import {OrderService} from "../../providers/order-service";

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
  finalOrder: Object;
  constructor(public orderService: OrderService) {
    this.finalOrder = new OrderToSend(orderService.getMeal(), orderService.getExtras(), orderService.getMeat());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubmitOrderPage');
  }

  submitOrder() {
    this.orderService.submitOrder(this.finalOrder);
  }

}

export class OrderToSend {
  meal: String;
  extras: Object;
  meat: String;

  constructor(meal: String, extras: Object, meat: String) {
    this.meal = meal;
    this.extras = extras;
    this.meat = meat;
  }
}

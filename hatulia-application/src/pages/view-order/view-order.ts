import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {OrderAPI} from '../../providers/order-api';



/*
 Generated class for the ViewOrder page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-view-order',
  templateUrl: 'view-order.html',
  providers: [OrderAPI]

})
export class ViewOrderPage {

  order:any;
  constructor(public navCtrl: NavController, public navParams: NavParams , public OrderAPI: OrderAPI) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewOrderPage');
    this.OrderAPI.getOrders();
    this.OrderAPI.orderChanged.subscribe(
      (order: any) => this.order = order
    );
  }
}

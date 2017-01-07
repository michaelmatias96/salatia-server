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
  chosenExtras: Array<String>;
  constructor(public navCtrl: NavController, private orderService: OrderService, private loadingCtrl: LoadingController) {
    console.log(orderService);
    this.extrasDetails = orderService.extrasDetails;
    this.chosenExtras = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateOrderExtrasPage');
  }

  public submitExtras() {
    this.presentLoading();
    this.orderService.setExtras(this.chosenExtras);
    this.navCtrl.push(ChooseMeatPage);
  }

  toggleExtra(id) {
    if (this.chosenExtras.some(x=>x==id)) {
      var index = this.chosenExtras.indexOf(id, 0);
      if (index > -1) {
        this.chosenExtras.splice(index, 1);
      }
    } else {
      this.chosenExtras.push(id);
    }
  }

  removeElementFromArray(key) {

  }

  getExtrasClass(id) {
    if (this.chosenExtras.some(x=>x==id)) {
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

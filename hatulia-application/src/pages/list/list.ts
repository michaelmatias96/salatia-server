/**
 * Created by michaelmatias on 12/31/16.
 */
import {Component} from "@angular/core";
import {NavController, NavParams} from 'ionic-angular';

@Component({
  templateUrl: 'build/pages/list/list.html'
})

export class ListPage {
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

  constructor(private navCtrl: NavController, navParams: NavParams) {
    this.selectedItem = navParams.get('item');

    this.icons = [];

    this.items = [];
    for(let i=0; i < 11; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item # ' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
  }

  itemTapped(event, item) {
    console.log('tapped on ' + item);
  }
}

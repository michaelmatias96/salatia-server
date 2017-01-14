/**
 * Created by danc on 2.1.2017.
 */

import {} from '@angular/core';
import {extraObject} from './extraObject';

/*
 Generated class for the OrderAPI provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular 2 DI.
 */
export class OrderObject {

  constructor(public orderType:number,
              public meatType: string,
              public name: string,
              public email: string,
              public phone: string,
              public orderDate: string,
              public extras: extraObject[],
              public finish: boolean,
              public finishTime: string) {
  }




}

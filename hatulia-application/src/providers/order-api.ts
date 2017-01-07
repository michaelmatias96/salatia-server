import { Injectable,EventEmitter } from '@angular/core';
import { Http ,Response} from '@angular/http';
import { OrderObject } from '../shared/OrderObject';
import { extraObject } from '../shared/extraObject';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';

/*
  Generated class for the OrderAPI provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class OrderAPI {
  private order: OrderObject;
  //Alert when there is a change
  orderChanged = new EventEmitter<OrderObject>();



  constructor(private http: Http) {}


  getOrder(){
    return this.order;
  }



  getData() {
  return this.http.get('http://192.168.31.39:8080/api/orders').map((response : Response) => response.json()).subscribe(
    (data : OrderObject) =>
    {
      this.order = data;
      this.orderChanged.emit(this.order);
    }
  );

    }
}

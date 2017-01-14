import { Injectable,EventEmitter } from '@angular/core';
import { Http ,Response} from '@angular/http';
import { OrderObject } from '../shared/OrderObject';
import { extraObject } from '../shared/extraObject';
import { AuthService } from '../providers/auth-service';
import {AuthHttp} from 'angular2-jwt';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';

/*
  Generated class for the OrderAPI provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class OrderAPI {
  private order: any;
  orderChanged = new EventEmitter<any>();



  constructor(private http: Http, public authHttp: AuthHttp, private authService:AuthService) {}


  getOrder(){
    return this.order;
  }


  getOrders(){
    return this.authHttp.get('http://localhost:4338/orders').map((response : Response) => response.json()).subscribe(
      (data : any) =>
      {
        this.order = data;
        console.log(data);

        this.orderChanged.emit(this.order);
      },
      error => console.log("Not found order for user")
    );
  }


}

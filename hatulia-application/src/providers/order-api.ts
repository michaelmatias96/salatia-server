import { Injectable,EventEmitter } from '@angular/core';
import { Http ,Response} from '@angular/http';
import { OrderObject } from '../shared/OrderObject';
import { extraObject } from '../shared/extraObject';
import { AuthService } from '../providers/auth-service';

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
  private authid: any;
  private user: any;
  //Alert when there is a change
  orderChanged = new EventEmitter<any>();



  constructor(private http: Http, private authService:AuthService) {}


  getOrder(){
    return this.order;
  }


  getDataForUser(){
    this.user = this.authService.user;
    this.authid = this.user.user_id;


    console.log(this.authid);


    return this.http.post('http://localhost:8080/order',{
      'userID' : this.authid
    }).map((response : Response) => response.json()).subscribe(
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

/**
 * Created by michaelmatias on 1/5/17.
 */

// src/services/auth/auth.service.ts

import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AppSettings } from "../app/config/AppSettings";
import { Http, Response } from '@angular/http';


// Avoid name not found warnings

@Injectable()
export class OrderService {
  order: Order;
  menuDetails: Object;
  menuDetailsChanged = new EventEmitter<Object>();

  constructor(private http: Http) {
    this.order = new Order();
    this.menuDetails = {};
    this.getMenuDetails()
      .subscribe(
        result => this.menuDetails = this.parseMenuDetails(result),
        error => alert(error)
      );
  }

  parseMenuDetails(result) {
    var parsedMenuDetails = {};
    var key;
    result.forEach(function(menuType) {
      key = Object.keys(menuType)[0];
      parsedMenuDetails[key] = menuType[key];
    });
    this.menuDetailsChanged.emit(parsedMenuDetails);
    return parsedMenuDetails;
  }

  public getMenuDetails() : Observable<Object> {
    return this.http.get(AppSettings.GET_MENU_DETAILS)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  public setMeal(mealId: string) {
    this.order.mealType = mealId;
  }

  public setExtras(extras: Array<string>) {
    this.order.extras = extras;
  }

  public setMeat(meatId: string) {
    this.order.meatType = meatId;
  }

  public submitOrder(finalOrder: Object) : Observable<Object> {
    return this.http.post(AppSettings.SUBMIT_ORDER_URL, finalOrder)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }
}

export class Order {
  mealType: string;
  extras: Array<string>;
  meatType: string;

  constructor(mealType = "", extras = [], meatType = "") {
    this.mealType = mealType;
    this.extras = extras;
    this.meatType = meatType;
  }
}

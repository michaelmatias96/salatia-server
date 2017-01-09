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
  mealDetails: Object;
  extrasDetails: Object;
  meatDetails: Object;
  mealsChanged = new EventEmitter<Object>();

  constructor(private http: Http) {
    this.order = new Order();
    this.getMealDetails()
      .subscribe(
        result => this.extractDetails(result),
        error => alert(error)
      );
    this.extrasDetails = AppSettings.EXTRAS_DETAILS;
    this.meatDetails = AppSettings.MEAT_DETAILS;
  }

  extractDetails(result) {
    this.mealDetails = result;
    this.mealsChanged.emit(this.mealDetails);
  }

  public getMealDetails() : Observable<Object> {
    return this.http.get(AppSettings.GET_MEAL_DETAILS)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  public setMeal(mealId: string) {
    this.order.setMeal(mealId);
  }

  public setExtras(extras: Array<string>) {
    this.order.setExtras(extras);
  }

  public setMeat(meatId: string) {
    this.order.setMeat(meatId);
  }

  public getMeal() {
    return this.order.getMeal();
  }

  public getExtras() {
    return this.order.getExtras();
  }

  public getMeat() {
    return this.order.getMeat();
  }

  public submitOrder(finalOrder: Object) : Observable<Object> {
    return this.http.post(AppSettings.SUBMIT_ORDER_URL, finalOrder)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }
}

export class Order {
  private _mealType: string;
  private _extras: Array<string>;
  private _meatType: string;

  constructor(mealType = "", extras = [], meatType = "") {
    this._mealType = mealType;
    this._extras = extras;
    this._meatType = meatType;
  }

  setMeal(mealId: string) {
    this._mealType = mealId;
  }

  setExtras(extras: Array<string>) {
    this._extras = extras;
  }

  setMeat(meatId: string) {
    this._meatType = meatId;
  }

  getMeal() {
    return this._mealType;
  }

  getExtras() {
    return this._extras;
  }

  getMeat() {
    return this._meatType;
  }
}

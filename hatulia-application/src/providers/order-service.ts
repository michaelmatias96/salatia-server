/**
 * Created by michaelmatias on 1/5/17.
 */

// src/services/auth/auth.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import {AppSettings} from "../app/config/AppSettings";

// Avoid name not found warnings

@Injectable()
export class OrderService {
  order: Order;
  mealDetails: Object;
  extrasDetails: Object;
  meatDetails: Object;

  constructor() {
    this.order = new Order();
    this.mealDetails = AppSettings.MEAL_DETAILS;
    this.extrasDetails = AppSettings.EXTRAS_DETAILS;
    this.meatDetails = AppSettings.MEAT_DETAILS;
  }

  public setMeal(mealId: String) {
    this.order.setMeal(mealId);
  }

  public setExtras(extras: Object) {
    this.order.setExtras(extras);
  }

  public setMeat(meatId: String) {
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

  public submitOrder(finalOrder: Object) {
    console.log("sending order: " + finalOrder);
    //send order to server
  }
}

export class Order {
  private _mealType: String;
  private _extras: Object;
  private _meatType: String;

  constructor() {
    this._mealType = "";
    this._extras = {};
    this._meatType = "";
  }

  setMeal(mealId: String) {
    this._mealType = mealId;
  }

  setExtras(extras: Object) {
    this._extras = extras;
  }

  setMeat(meatId: String) {
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

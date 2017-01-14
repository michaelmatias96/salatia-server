import { NgModule, ErrorHandler } from '@angular/core';
import { Http } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ProfilePage } from '../pages/profile/profile';
import { CreateOrderPage } from '../pages/create-order/create-order';
import { CreateOrderExtrasPage } from '../pages/create-order-extras/create-order-extras';
import { ChooseMeatPage } from '../pages/choose-meat/choose-meat';
import { ViewOrderPage } from '../pages/view-order/view-order';
import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { AuthService } from '../providers/auth-service';
import { OrderService } from '../providers/order-service';
import { Storage } from '@ionic/storage';
import { OrderAPI } from '../providers/order-api';
import {SubmitOrderPage} from "../pages/submit-order/submit-order";
import {ValuesPipe} from "../pipes/pipe";

let storage: Storage = new Storage();

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => storage.get('id_token'))
  }), http);
}

@NgModule({
  declarations: [
    MyApp,
    ProfilePage,
    ViewOrderPage,
    CreateOrderPage,
    CreateOrderExtrasPage,
    ChooseMeatPage,
    SubmitOrderPage,
    ValuesPipe
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ViewOrderPage,
    ProfilePage,
    CreateOrderPage,
    CreateOrderExtrasPage,
    ChooseMeatPage,
    SubmitOrderPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    OrderAPI,
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http]
    },
    OrderService
  ]
})
export class AppModule {}

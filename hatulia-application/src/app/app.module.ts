import { NgModule, ErrorHandler } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { ProfilePage } from '../pages/profile/profile';
import { CreateOrderPage } from '../pages/create-order/create-order';
import { CreateOrderExtrasPage } from '../pages/create-order-extras/create-order-extras';
import { ChooseMeatPage } from '../pages/choose-meat/choose-meat';
import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { AuthService } from '../providers/auth-service.ts';
import { OrderService } from '../providers/order-service';
import { Storage } from '@ionic/storage';
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
    HomePage,
    ItemDetailsPage,
    ListPage,
    ProfilePage,
    CreateOrderPage,
    CreateOrderExtrasPage,
    ChooseMeatPage,
    SubmitOrderPage,
    ValuesPipe
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ItemDetailsPage,
    ListPage,
    ProfilePage,
    CreateOrderPage,
    CreateOrderExtrasPage,
    ChooseMeatPage,
    SubmitOrderPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: []
    },
    OrderService
  ]
})
export class AppModule {}

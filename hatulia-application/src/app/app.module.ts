import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { ViewOrderPage } from '../pages/view-order/view-order';
import { ProfilePage } from '../pages/profile/profile';
import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { AuthService } from '../providers/auth-service.ts';
import { HttpModule } from '@angular/http';
import { Storage } from '@ionic/storage';
import { OrderAPI } from '../providers/order-api';



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
    ViewOrderPage
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
    ViewOrderPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},

    AuthService,
    OrderAPI,
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [HttpModule]
    }
  ]
})
export class AppModule {}

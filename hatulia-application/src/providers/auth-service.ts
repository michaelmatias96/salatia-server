import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Observable";

/*
  Generated class for the AuthService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

export class User {
  name: string;
  email: string;

  constructor(name: string, email:string) {
    this.name = name;
    this.email = email;
  }
}

@Injectable()
export class AuthService {
  currentUser: User;
  private authenticationUrl = 'http://localhost:8080/auth';

  constructor (private http: Http) {}

  isUserAuthenticated(credentials) {
    return this.http.get(this.authenticationUrl + '/login', credentials)
      .map(response => response.json());
  }

  loginLogic(data) {
    this.currentUser = new User(data.data.name, data.data.email);
  }

  public login(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        this.isUserAuthenticated(credentials)
          .subscribe(data => {
            this.currentUser = new User(data.data.name, data.data.email);
            let access = (data.success == true);
            observer.next(access);
            observer.complete();
          }, error => {
            console.error('Error');
          }, () => {
            console.log('Completed!');
          });

      });
    }
  }

  public register(credentials) {
    if (credentials.email === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      // At this point store the credentials to your backend!
      return Observable.create(observer => {
        observer.next(true);
        observer.complete();
      });
    }
  }

  public getUserInfo() : User {
    return this.currentUser;
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }

}

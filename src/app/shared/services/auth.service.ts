import 'rxjs/add/operator/toPromise';

import { Injectable, Inject, OnInit } from '@angular/core';

import { ApiService } from './api.service';
import { HttpHeaders } from '@angular/common/http';
import * as decode from 'jwt-decode';
import {SESSION_STORAGE, LOCAL_STORAGE, WebStorageService} from 'angular-webstorage-service';
import { HandleAPIService } from './handle-api.service';
import { UserRole } from '../models/user';

@Injectable()
export class AuthService implements OnInit {
    tokenData: any;
    loading = false;
    userRole: UserRole = new UserRole();
    url = '';
    constructor(
      @Inject(SESSION_STORAGE) private storage: WebStorageService,
      @Inject(LOCAL_STORAGE) private localStorage: WebStorageService,
      private api: ApiService) {
      }

      ngOnInit() {
      }

    getHeader() {
        const token = this.getFromLocal('token');
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token })
        };
        return httpOptions;
      }
    setAPIUrl() {
      this.api.setApiURL();
      this.url = this.api.url;
    }
    login(accountInfo: any) {
      const httpOptions = {
        // headers: new HttpHeaders({ 'Content-Type': 'application/json' }) text/plain
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      };
      const body = JSON.stringify(accountInfo);
      // const requestOptions = new HttpRequest(({method: RequestMethod.Post, headers: headerOption});
      const seq = this.api.post('api/Token', body, httpOptions);
      return seq;
    }
    removeToken() {
      this.storage.remove('token');
      this.storage.remove('isAdmin');
      this.storage.remove('id');
    }
    saveInLocal(key, val): void {
        // console.log('recieved= key:' + key + 'value:' + val);
        this.storage.set(key, val);
    }
    saveInLocalStorage(key, val): void {
      this.localStorage.set(key, val);
    }
    getFromLocal(key): string {
      // console.log('recieved= key:' + key);
      return this.storage.get(key);
      // console.log(this.data);
    }
    getFromLocalStorage(key): any {
      return this.localStorage.get(key);
    }
    decodeToken() {
      const tk = this.getFromLocal('token');
      // console.log(tk);
      if (tk) {
        this.tokenData = decode(tk);
        return this.tokenData;
      }
      return false;
    }
    getUserName() {
      const td = this.getFromLocal('username');
      return td;
    }

    getUserID() {
      const td = this.decodeToken();
      return td.sid;
    }

    isTokenValid() {
      const td = this.decodeToken();
      if (td) {
        // console.log(td);
        const current_time = new Date().getTime() / 1000;
        if (!(current_time > td.exp)) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
    getByID(id: any, url: string) {
      const token = this.getFromLocal('token');
      const headerOption = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + token
      });
      const httpOptions = {
        // headers: new HttpHeaders({ 'Content-Type': 'application/json' }) text/plain
        headers: headerOption
      };
      const body = '';
      // const requestOptions = new HttpRequest(({method: RequestMethod.Post, headers: headerOption});
      const seq = this.api.get(url + '/' + id, body, httpOptions);
      return seq;
    }
    isAdmin() {
      return this.getFromLocal('isAdmin');
    }
    userRight(username: string) {
      const body = '';
      const seq = this.api.get('api/GetUserRole/' + username, body, this.getHeader());
      return seq;
    }
    getUserRight(username) {
      const body = '';
      this.api.get('api/GetUserRole/' + username, body, this.getHeader())
      .subscribe( (data: any) => {
        // console.log(data);
          this.userRole.IsAdmin = data.IsAdmin;
          this.userRole.UserRoleID = data.UserRoleID;
          this.userRole.UserName = data.UserName;
          this.userRole.ApprovePR = data.ApprovePR;
          this.userRole.ApproveDV = data.ApproveDV;
          this.userRole.ApproveGR = data.ApproveGR;
          this.userRole.ApproveCOA = data.ApproveCOA;
          this.userRole.ViewPR = data.ViewPR;
          this.userRole.ViewDV = data.ViewDV;
          this.userRole.ViewGR = data.ViewGR;
          this.userRole.ViewCOA = data.ViewCOA;
        },
        error => {
          console.log(error);
        }
    );
    // console.log(this.userRole);
    return this.userRole;
    }
  }

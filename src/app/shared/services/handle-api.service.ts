import 'rxjs/add/operator/toPromise';

import { Injectable, Inject } from '@angular/core';

import { ApiService } from './api.service';
import { HttpHeaders } from '@angular/common/http';

import { AuthService } from './auth.service';

@Injectable()
export class HandleAPIService {

  constructor(private api: ApiService, private authService: AuthService) { }
  getHeader() {
    const token = this.authService.getFromLocal('token');
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token })
    };

    return httpOptions;
  }
  create(comp: any, url: string) {
    const body = JSON.stringify(comp);
    // const requestOptions = new HttpRequest(({method: RequestMethod.Post, headers: headerOption});
    const seq = this.api.post(url, body, this.getHeader());

    return seq;
  }

  update(comp: any, url: string) {
    const body = JSON.stringify(comp);
    // const requestOptions = new HttpRequest(({method: RequestMethod.Post, headers: headerOption});
    const seq = this.api.put(url, body, this.getHeader());

    return seq;
  }

  get(url: string) {
    const body = '';
    // const requestOptions = new HttpRequest(({method: RequestMethod.Post, headers: headerOption});
    const seq = this.api.get(url, body, this.getHeader());

    return seq;
  }
  getURL(url: string) {
    const body = '';
    // const requestOptions = new HttpRequest(({method: RequestMethod.Post, headers: headerOption});
    const seq = this.api.getURL(url, body, this.getHeader());

    return seq;
  }
  get_param(body: any, url: string) {
    // const body = '';
    // const requestOptions = new HttpRequest(({method: RequestMethod.Post, headers: headerOption});
    const seq = this.api.get(url, body, this.getHeader());

    return seq;
  }

  getByID(id: number, url: string) {
    const body = '';
    // const requestOptions = new HttpRequest(({method: RequestMethod.Post, headers: headerOption});
    const seq = this.api.get(url + '/' + id, body, this.getHeader());

    return seq;
  }

  delete(id: number, url: string) {
    const body = '';
    // const requestOptions = new HttpRequest(({method: RequestMethod.Post, headers: headerOption});
    const seq = this.api.delete(url + '/' + id, this.getHeader());

    return seq;
  }

  deleteWithUserID(id: number, url: string, userID: number) {
    const body = '';
    // const requestOptions = new HttpRequest(({method: RequestMethod.Post, headers: headerOption});
    const seq = this.api.delete(url + '/' + id + '?userID=' + userID, this.getHeader());

    return seq;
  }

}

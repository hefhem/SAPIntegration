import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HandleErrorService } from './handle-error.service';
import { environment } from 'src/environments/environment';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class ApiService implements OnInit {
  url = environment.api_url;
  // url = this.setApiURL();

  constructor(public http: HttpClient, public handleError: HandleErrorService) {
  }

  ngOnInit() {
  }
  getUrl() {
    return this.http
      .get('/assets/api-url.json');
  }
  setApiURL() {
    let url = '';
    this.getUrl()
    .subscribe( (data: any) => {
      url = data.url;
      console.log(url);
    });
   return url.toString();
  }
  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      // tslint:disable-next-line:forin
      for (const k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }
    // this.url = this.setApiURL();
    // console.log(this.setApiURL());
    return this.http.get(this.url + '/' + endpoint, reqOpts)
      .pipe(
        catchError(this.handleError.handleError)
      );
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    // this.url = this.setApiURL();
    return this.http.post(this.url + '/' + endpoint, body, reqOpts)
      .pipe(
        catchError(this.handleError.handleError)
      );
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    // this.url = this.setApiURL();
    return this.http.put(this.url + '/' + endpoint, body, reqOpts)
      .pipe(
        catchError(this.handleError.handleError)
      );
  }

  delete(endpoint: string, reqOpts?: any) {
    // this.url = this.setApiURL();
    return this.http.delete(this.url + '/' + endpoint, reqOpts)
      .pipe(
        catchError(this.handleError.handleError)
      );
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    // this.url = this.setApiURL();
    return this.http.patch(this.url + '/' + endpoint, body, reqOpts)
      .pipe(
        catchError(this.handleError.handleError)
      );
  }
}

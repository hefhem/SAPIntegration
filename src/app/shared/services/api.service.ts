import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HandleErrorService } from './handle-error.service';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class ApiService {
  url = 'http://localhost:59350';

  constructor(public http: HttpClient, public handleError: HandleErrorService) {
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

    return this.http.get(this.url + '/' + endpoint, reqOpts)
      .pipe(
        catchError(this.handleError.handleError)
      );
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url + '/' + endpoint, body, reqOpts)
      .pipe(
        catchError(this.handleError.handleError)
      );
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url + '/' + endpoint, body, reqOpts)
      .pipe(
        catchError(this.handleError.handleError)
      );
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url + '/' + endpoint, reqOpts)
      .pipe(
        catchError(this.handleError.handleError)
      );
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.patch(this.url + '/' + endpoint, body, reqOpts)
      .pipe(
        catchError(this.handleError.handleError)
      );
  }
}

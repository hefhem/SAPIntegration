import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';


@Injectable()
export class HandleErrorService {

  constructor() { }

  handleError(error: HttpErrorResponse) {
    let errorMsg = 'please try again later.';
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      // tslint:disable-next-line:triple-equals
      if (error.status == 401) {
        errorMsg = 'Access denied!';
      // tslint:disable-next-line:triple-equals
      } else if (error.status == 200) {
        errorMsg = 'All green!';
      // tslint:disable-next-line:triple-equals
      } else if (error.status == 0) {
        errorMsg = 'Server not available.';
      // tslint:disable-next-line:triple-equals
      } else if (error.status == 400) {
        errorMsg = 'Bad request to the server.';
      // tslint:disable-next-line:triple-equals
      } else if (error.status == 404) {
        errorMsg = 'Resource not found.';
      // tslint:disable-next-line:triple-equals
      } else if (error.status == 500) {
        errorMsg = 'Internal server error';
      } else if (error.error.object) {
        errorMsg = 'please check the console.';
      } else if (error.error.Message) {
        errorMsg = error.error.Message;
      } else if (error.error.error_description) {
        errorMsg = error.error.error_description;
      } else if (error.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('An error occurred:', error.error.message);
        errorMsg = error.error.message;
      } else {
        errorMsg = error.error;
      }
      // console.error(error.status);
      console.error(JSON.stringify(error, undefined, 2));
    // return an observable with a user-facing error message
    return throwError(errorMsg);
  }
}

import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';


@Injectable()
export class HandleErrorService {

  constructor() { }

  handleError(error: HttpErrorResponse) {
    let errorMsg = 'please try again later.';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      errorMsg = error.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      if (error.error.error_description) {
        errorMsg = error.error.error_description;
      }
      if (error.error.Message) {
        errorMsg = error.error.Message;
      }
      if (error.status === 0) {
        errorMsg = 'Error accessing server.';
      }
      if (error.error.object) {
        errorMsg = 'please check the console.';
      } else {
        errorMsg = error.error;
      }
      console.error(error.error);
    }
    // return an observable with a user-facing error message
    return throwError(errorMsg);
  }

  handleErrorOld(error: HttpErrorResponse) {
    console.log(error);
    let errorMsg: any = 'Something bad happened; please try again later.';
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      errorMsg = error.error.message;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      // console.error(error);
      if (error.error.error_description) {
        errorMsg = error.error.error_description;
      }
      if (error.error.Message) {
        errorMsg = error.error.Message;
      }
      if (error.status === 0) {
        return 'Error accessing server.';
      }
      // if (error.error) {
      //   errorMsg = error.error;
      // }
    }
    // return an ErrorObservable with a user-facing error message
    return  new ErrorObservable (errorMsg);
  }

}

import { Injectable } from '@angular/core';
import {
  HttpBackend,
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from '../environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class VisualizerService {
  serverUrl = environment.serverUrl;

  //preparation of the verification token

  auth_token = 'L0BdZujyXDd0pWakIU_5OC_a-r-bqPjk3vOUO4LVU_k';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${this.auth_token}`,
  });

  requestOptions = { headers: this.headers };

  private http: HttpClient;
  constructor(handler: HttpBackend) {
    this.http = new HttpClient(handler);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened. Please try again later.');
  }

  //function that retrieves data according to a date

  get_data(date) {
    return this.http
      .get<[]>(this.serverUrl + 'getPosts?day=' + date, this.requestOptions)
      .pipe(catchError(this.handleError));
  }

  //function that collects the topics of all products

  getProductCategorie() {
    return this.http
      .get<[]>(this.serverUrl + 'getProductCategorie', this.requestOptions)
      .pipe(catchError(this.handleError));
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AddRoomService {

  private baseUrl = 'http://localhost:8880';
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  addRoom(payload: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/room/create', payload, {headers: this.headers})
    .pipe(catchError(this.handleError));
    // .subscribe(response => {
    //   console.log('Form submitted successfully', response);
    // });
  }

  private handleError(error: any) {
    console.error('AddRoomService error', error);
    return throwError(() => error);
  }
  
}

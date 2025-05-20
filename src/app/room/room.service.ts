import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Room } from '../model/room.model';
import { catchError, map, Observable, throwError } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'http://localhost:8880';

  constructor(private http: HttpClient, private keycloak: KeycloakService) { }

  getRooms(): Observable<Room[]> {
    // const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const headers = {'Content-Type': 'application/json'};
    //  return this.http.get('http://localhost:8882/room/retrieveRoomList?hotelId=55LQ23392D299EGGVK', {responseType: 'text'});
    //  return this.http.get<Room[]>('${this.apiUrl}/room/retrieveRoomList?hotelId=55LQ23392D299EGGVK', {headers});
     
    console.log('Token'+JSON.stringify(this.keycloak.getToken()));
    return this.http.get<Room[]>('http://localhost:8880/room/retrieveRoomList?hotelId=55LQ23392D299EGGVK', {headers});
    //  return this.http.get<Room[]>('http://localhost:8880/room/retrieveRoomList?hotelId=55LQ23392D299EGGVK', {
    //                     headers: { Authorization: 'Bearer ' + this.keycloak.getToken() },
    //         });//Its not required due to cfg in app module for any request

   
    console.log("Room Service : ");

    //  let headers = new Headers();
    //  headers.append('Content-Type', 'application/json');
    // //  headers.append('hotelId', '55LQ23392D299EGGVK');
    //  let params = new URLSearchParams();
    //  params.append('hotelId', '55LQ23392D299EGGVK');
    //  return this.http.get<Room[]>('http://localhost:8882/room/retrieveRoomList', { headers: headers, search: params });

     
    //  this.http.get('http://localhost:63203/api/CallCenter/GetSupport', { headers: headers, search: params })

    //  return this.http.get('http://localhost:8882/room/retrieveRoomList?hotelId=55LQ23392D299EGGVK', {responseType: 'text'}).pipe(map(response => JSON.parse(response)),catchError(this.handleError));
  }

  

  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server-side error: ${error.status} ${error}`;
    }
    console.log(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

}

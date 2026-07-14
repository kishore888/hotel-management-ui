import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RoomType } from '../../model/room-type.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoomTypeService {

  private apiUrl = `${environment.baseUrl}/room/roomType`;

  constructor(private http: HttpClient) { }

  getRoomTypes(): Observable<RoomType[]> {
    const headers = {'Content-Type': 'application/json'};
    return this.http.get<RoomType[]>(`${this.apiUrl}/retrieveRoomTypes`, {headers});
  }

  createRoomType(formData: any): Observable<any> {
    const headers = {'Content-Type': 'application/json'};
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json'
    // });
    return this.http.post(`${this.apiUrl}/create`, formData, {headers, responseType: 'text'});

  }
}

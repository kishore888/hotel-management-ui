import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RoomType } from '../../model/room-type.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomTypeService {

  constructor(private http: HttpClient) { }

  getRoomTypes(): Observable<RoomType[]> {
    const headers = {'Content-Type': 'application/json'};
    return this.http.get<RoomType[]>('http://localhost:8880/room/roomType/retrieveRoomTypes', {headers});
  }
}

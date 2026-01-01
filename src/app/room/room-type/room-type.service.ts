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

  createRoomType(formData: any) {
    const headers = {'Content-Type': 'application/json'};
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json'
    // });
    this.http.post('http://localhost:8880/room/roomType/create', formData, {headers}).subscribe(response => {
      console.log('Form submitted successfully', response);
    });;
    
  }
}

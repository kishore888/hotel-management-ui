import { Injectable } from '@angular/core';
import { RoomType } from './model/room-type.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private roomTypes: RoomType[] = [];
  private baseUrl = "http://localhost:8880/";
  private roomTypeUrl = "roomType/retrieveList";

  constructor(private http: HttpClient) { }

  setRoomTypes(roomTypes: RoomType[]): void {
    this.roomTypes = roomTypes;
  }

  getRoomTypes(): RoomType[] {
    return this.roomTypes;
  }

  
}

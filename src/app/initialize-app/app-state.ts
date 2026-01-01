import { Hotel } from "../model/hotel.model";
import { Room } from "../model/room.model";

export interface AppState {
    hotel: Hotel | null;
    // products: any[];
    // orders: any[];
}

export interface RoomState { 
  rooms: Room[]; 
  loading: boolean; 
  error: string | null; 
}
  
import { Hotel } from "../model/hotel.model";
import { Room } from "../model/room.model";
import { Employee } from "../model/employee.model";
import { FieldConfig } from "../model/form-config.model";

export interface AppState {
    hotel:       Hotel | null;
    employees:   Employee[];
    formConfigs: { [entityType: string]: FieldConfig[] };
}

export interface RoomState { 
  rooms: Room[]; 
  loading: boolean; 
  error: string | null; 
}
  
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HotelPlanMaster } from '../../model/hotel-plan-master.model';

@Injectable({
  providedIn: 'root'
})
export class PlanMasterService {

  constructor(private http: HttpClient) { }

  getHotelPlans(): Observable<HotelPlanMaster[]> {
    const headers = {'Content-Type': 'application/json'};
    return this.http.get<HotelPlanMaster[]>('http://localhost:8880/room/hotelPlanMaster/retrieveHotelPlanMasterList', {headers});
  }
}

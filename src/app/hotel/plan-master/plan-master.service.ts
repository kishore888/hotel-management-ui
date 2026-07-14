import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HotelPlanMaster } from '../../model/hotel-plan-master.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlanMasterService {

  private apiUrl = `${environment.baseUrl}/room/hotelPlanMaster`;
  
  constructor(private http: HttpClient) { }

  getHotelPlans(): Observable<HotelPlanMaster[]> {
    const headers = {'Content-Type': 'application/json'};
    return this.http.get<HotelPlanMaster[]>(`${this.apiUrl}/retrieveList`, {headers});
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HotelPlanService {
  private apiUrl = `${environment.baseUrl}/room/hotelPlanMaster`;

  constructor(private http: HttpClient) {}

  createHotelPlan(payload: unknown): Observable<unknown> {
    return this.http.post<unknown>(`${this.apiUrl}/create`, payload);
  }
}

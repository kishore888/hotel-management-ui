import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private apiUrl = `${environment.baseUrl}/room/reservation`;

  constructor(private http: HttpClient) { }

  createReservation(payload: unknown): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.apiUrl}/bookRooms`, payload, {
      headers: { 'Content-Type': 'application/json' },
      observe: 'response',
      responseType: 'text' as 'json'
    });
  }
}

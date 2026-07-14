import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CreateHotelService {
  private baseUrl = 'http://localhost:8880';

  constructor(private http: HttpClient) {}

  createHotel(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/hotel/create`, payload);
  }
}

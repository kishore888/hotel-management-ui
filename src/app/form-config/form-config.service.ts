import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FieldConfig } from '../model/form-config.model';

@Injectable({ providedIn: 'root' })
export class FormConfigService {
  private apiUrl = 'http://localhost:8880/employee/form-config';

  constructor(private http: HttpClient) {}

  getConfig(hotelId: string, entityType: string): Observable<FieldConfig[]> {
    return this.http.get<FieldConfig[]>(`${this.apiUrl}/list?hotelId=${hotelId}&entityType=${entityType}`);
  }

  // saveConfig(hotelId: string, entityType: string, fields: FieldConfig[]): Observable<void> {
  //   return this.http.post<void>(`${this.apiUrl}/save?hotelId=${hotelId}&entityType=${entityType}`, fields);
  // }

  saveConfig(fields: FieldConfig[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/save`, fields);
  }
}

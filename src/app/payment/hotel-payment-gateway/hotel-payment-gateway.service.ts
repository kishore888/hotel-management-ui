import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PaymentGateway } from '../../model/payment-gateway';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HotelPaymentGatewayService {
  private apiUrl = `${environment.baseUrl}/payment/hotelPaymentGateway`;
  private readonly headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  getHotelPaymentGateways(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/retrieveList?hotelId=55LQ23392D299EGGVK`, { headers: this.headers });
  }

  getPaymentGateways(): Observable<PaymentGateway[]> {
    return this.http.get<PaymentGateway[]>(`${this.apiUrl}/retrieveList`, { headers: this.headers });
  }

  createHotelPaymentGateway(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, payload, {
      headers: this.headers,
      responseType: 'text'
    }).pipe(
      map((response) => {
        try {
          return JSON.parse(response);
        } catch {
          return response;
        }
      }),
      catchError((error) => {
        console.error('Hotel payment gateway API error', error);
        return of(error);
      })
    );
  }
}

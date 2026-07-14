import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentGatewayService {
  private apiUrl = `${environment.baseUrl}/payment/paymentGateway`;
  private readonly headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  createPaymentGateway(payload: any): Observable<any> {
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
        console.error('Payment gateway API error', error);
        return of(error);
      })
    );
  }
}

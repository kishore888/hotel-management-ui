import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentAccount } from '../../model/payment-account.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentAccountService {
  private apiUrl = `${environment.baseUrl}/payment/paymentAccount`;
  private readonly headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  getPaymentAccounts(): Observable<PaymentAccount[]> {
    return this.http.get<PaymentAccount[]>(`${this.apiUrl}/retrieveList?hotelId=55LQ23392D299EGGVK`, { headers: this.headers });
  }

  createPaymentAccount(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, payload, { headers: this.headers });
  }
}

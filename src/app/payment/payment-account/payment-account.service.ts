import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentAccount } from '../../model/payment-account.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentAccountService {

  constructor(private http: HttpClient) { }

  getPaymentAccounts(): Observable<PaymentAccount[]> {
    const headers = {'Content-Type': 'application/json'};
    return this.http.get<PaymentAccount[]>('http://localhost:8880/payment/paymentAccount/retrieveList?hotelId=55LQ23392D299EGGVK', {headers});
  }
  
}

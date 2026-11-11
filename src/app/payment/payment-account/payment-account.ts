import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PaymentAccountService } from './payment-account.service';
import { HotelPaymentGatewayService } from '../hotel-payment-gateway/hotel-payment-gateway.service';
import { PaymentAccount as PaymentAccountModel } from '../../model/payment-account.model';
import { HotelPaymentGateway } from '../../model/hotel-payment-gateway';
import { Hotel } from '../../model/hotel.model';

@Component({
  selector: 'app-payment-account',
  standalone: false,
  templateUrl: './payment-account.html',
  styleUrl: './payment-account.css',
})
export class PaymentAccount implements OnInit {
  paymentAccount: PaymentAccountModel = new PaymentAccountModel('', '', '', '', '', {} as HotelPaymentGateway, '', new Date(), '', new Date(), '', { hotelId: '55LQ23392D299EGGVK' } as unknown as Hotel);
  hotelPaymentGateways: HotelPaymentGateway[] = [];
  isSubmitting = false;

  constructor(
    private paymentAccountService: PaymentAccountService,
    private hotelPaymentGatewayService: HotelPaymentGatewayService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadHotelPaymentGateways();
  }

  loadHotelPaymentGateways(): void {
    this.hotelPaymentGatewayService.getHotelPaymentGateways().subscribe({
      next: (response: HotelPaymentGateway[]) => {
        this.hotelPaymentGateways = Array.isArray(response) ? response : [];
        this.cdr.detectChanges();
      },
      error: (error: unknown) => {
        console.error('Error loading hotel payment gateways', error);
      }
    });
  }

  onSubmit(form: any): void {
    if (form.invalid) {
      return;
    }

    this.isSubmitting = true;
    const hotelId = this.paymentAccount.hotel?.hotelId || null;
    const payload = {
      name: this.paymentAccount.name,
      code: this.paymentAccount.code,
      bankName: this.paymentAccount.bankName,
      upiId: this.paymentAccount.upiId,
      billCount: Number(this.paymentAccount.billCount ?? 0),
      hotel: { hotelId },
      hotelPaymentGateway: this.paymentAccount.hotelPaymentGateway?.hotelPaymentGatewayId
        ? { hotelPaymentGatewayId: this.paymentAccount.hotelPaymentGateway.hotelPaymentGatewayId }
        : null
    };

    this.paymentAccountService.createPaymentAccount(payload).subscribe({
      next: () => {
        form.resetForm();
        this.paymentAccount = new PaymentAccountModel('', '', '', '', '', {} as HotelPaymentGateway, '', new Date(), '', new Date(), '', { hotelId: '55LQ23392D299EGGVK' } as unknown as Hotel);
        this.isSubmitting = false;
      },
      error: (error: unknown) => {
        console.error('Error creating payment account', error);
        this.isSubmitting = false;
      }
    });
  }
}

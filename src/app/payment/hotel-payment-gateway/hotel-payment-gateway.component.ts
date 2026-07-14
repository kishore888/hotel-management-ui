import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HotelPaymentGatewayService } from './hotel-payment-gateway.service';
import { HotelPaymentGateway } from '../../model/hotel-payment-gateway';
import { PaymentGateway } from '../../model/payment-gateway';
import { Hotel } from '../../model/hotel.model';

@Component({
  selector: 'app-hotel-payment-gateway',
  standalone: false,
  templateUrl: './hotel-payment-gateway.component.html',
  styleUrl: './hotel-payment-gateway.component.css'
})
export class HotelPaymentGatewayComponent implements OnInit {
  gateway: HotelPaymentGateway = new HotelPaymentGateway('', {} as Hotel, {} as PaymentGateway, '', '', '', true, '', new Date(), '', new Date());
  paymentGateways: PaymentGateway[] = [];
  isSubmitting = false;

  constructor(
    private hotelPaymentGatewayService: HotelPaymentGatewayService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPaymentGateways();
  }

  loadPaymentGateways(): void {
    this.hotelPaymentGatewayService.getPaymentGateways().subscribe({
      next: (response: PaymentGateway[]) => {
        this.paymentGateways = Array.isArray(response) ? response : [];
        this.cdr.detectChanges();
      },
      error: (error: unknown) => {
        console.error('Error loading payment gateways', error);
      }
    });
  }

  onSubmit(form: any): void {
    if (form.invalid) {
      return;
    }

    this.isSubmitting = true;
    const payload = {
      merchantId: this.gateway.merchantId,
      merchantKey: this.gateway.merchantKey,
      salt: this.gateway.salt,
      isActive: this.gateway.isActive,
      hotel: { hotelId: '55LQ23392D299EGGVK' },
      paymentGateway: this.gateway.paymentGateway?.paymentGatewayId
        ? { paymentGatewayId: this.gateway.paymentGateway.paymentGatewayId }
        : null
    };

    this.hotelPaymentGatewayService.createHotelPaymentGateway(payload).subscribe({
      next: (response: unknown) => {
        console.log('Hotel payment gateway response', response);
        form.resetForm();
        this.gateway = new HotelPaymentGateway('', {} as Hotel, {} as PaymentGateway, '', '', '', true, '', new Date(), '', new Date());
        this.isSubmitting = false;
      },
      error: (error: unknown) => {
        console.error('Error creating hotel payment gateway', error);
        this.isSubmitting = false;
      }
    });
  }
}

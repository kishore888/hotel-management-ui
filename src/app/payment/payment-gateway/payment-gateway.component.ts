import { Component } from '@angular/core';
import { PaymentGatewayService } from './payment-gateway.service';
import { PaymentGateway } from '../../model/payment-gateway';

@Component({
  selector: 'app-payment-gateway',
  standalone: false,
  templateUrl: './payment-gateway.component.html',
  styleUrl: './payment-gateway.component.css'
})
export class PaymentGatewayComponent {
  gateway: PaymentGateway = new PaymentGateway('', '', true, '', '', '', '', '', new Date(), '', new Date());
  isSubmitting = false;

  constructor(private paymentGatewayService: PaymentGatewayService) {}

  onSubmit(form: any): void {
    if (form.invalid) {
      return;
    }

    this.isSubmitting = true;
    const payload = {
      paymentGatewayName: this.gateway.paymentGatewayName,
      baseUrl: this.gateway.baseUrl,
      merchantId: this.gateway.merchantId,
      merchantKey: this.gateway.merchantKey,
      salt: this.gateway.salt,
      isActive: this.gateway.isActive
    };

    this.paymentGatewayService.createPaymentGateway(payload).subscribe({
      next: (response: unknown) => {
        console.log('Payment gateway response', response);
        form.resetForm();
        this.gateway = new PaymentGateway('', '', true, '', '', '', '', '', new Date(), '', new Date());
        this.isSubmitting = false;
      },
      error: (error: unknown) => {
        console.error('Error creating payment gateway', error);
        this.isSubmitting = false;
      }
    });
  }
}

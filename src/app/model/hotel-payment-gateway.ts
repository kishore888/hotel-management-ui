import { Hotel } from "./hotel.model";
import { PaymentGateway } from "./payment-gateway";

export class HotelPaymentGateway {
    constructor(
        hotelPaymentGatewayId?: String,
        hotel?: Hotel,
        paymentGateway?: PaymentGateway,
        merchantId?: String,
        merchantKey?: String,
        salt?: String,
        isActive?: Boolean,
        createdBy?: String,
        createdOn?: Date,
        updatedBy?: String,
        updatedOn?: Date
    ) {
        this.hotelPaymentGatewayId = hotelPaymentGatewayId || '';
        this.hotel = hotel || {} as any;
        this.paymentGateway = paymentGateway || {} as any;
        this.merchantId = merchantId || '';
        this.merchantKey = merchantKey || '';
        this.salt = salt || '';
        this.isActive = isActive || false,
        this.createdBy = createdBy;
        this.createdOn = createdOn;
        this.updatedBy = updatedBy;
        this.updatedOn = updatedOn;
    }

    hotelPaymentGatewayId: String;
    hotel: Hotel;
    paymentGateway: PaymentGateway;
    merchantId: String;
    merchantKey: String;
    salt: String;
    isActive: Boolean;
    createdBy?: String;
    createdOn?: Date;
    updatedBy?: String;
    updatedOn?: Date;
}
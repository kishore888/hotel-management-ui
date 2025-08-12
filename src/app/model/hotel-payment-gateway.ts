import { Hotel } from "./hotel.model";
import { PaymentGateway } from "./payment-gateway";

export class HotelPaymentGateway {
    constructor(
        hotelPaymentGatewayId: String,
        hotel: Hotel,
        paymentGateway: PaymentGateway,
        merchantId: String,
        merchantKey: String,
        salt: String,
        isActive: Boolean,
        createdBy: String,
        createdOn: Date,
        updatedBy: String,
        updatedOn: Date
    ) {
        this.hotelPaymentGatewayId = hotelPaymentGatewayId;
        this.hotel = hotel;
        this.paymentGateway = paymentGateway;
        this.merchantId = merchantId;
        this.merchantKey = merchantKey;
        this.salt = salt;
        this.isActive = isActive,
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
    createdBy: String;
    createdOn: Date;
    updatedBy: String;
    updatedOn: Date;
}
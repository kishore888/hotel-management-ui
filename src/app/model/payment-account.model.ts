import { Hotel } from "./hotel.model";
import { HotelPaymentGateway } from "./hotel-payment-gateway";

export class PaymentAccount {
    constructor(
        paymentAccountId: String,
        name: String,
        code: String,
        bankName: String,
        billCount: String,
        hotelPaymentGateway: HotelPaymentGateway,
        createdBy: String,
        createdOn: Date,
        updatedBy: String,
        updatedOn: Date,
        upiId?: String,
        hotel?: Hotel
    ) {
        this.paymentAccountId = paymentAccountId;
        this.name = name;
        this.code = code;
        this.bankName = bankName;
        this.billCount = billCount;
        this.hotelPaymentGateway = hotelPaymentGateway;
        this.createdBy = createdBy;
        this.createdOn = createdOn;
        this.updatedBy = updatedBy;
        this.updatedOn = updatedOn;
        this.upiId = upiId || '';
        this.hotel = hotel || {} as Hotel;
    }

    paymentAccountId: String;
    name: String;
    code: String;
    bankName: String;
    billCount: String;
    hotelPaymentGateway: HotelPaymentGateway;
    hotel: Hotel;
    createdBy: String;
    createdOn: Date;
    updatedBy: String;
    updatedOn: Date;
    upiId: String;
}
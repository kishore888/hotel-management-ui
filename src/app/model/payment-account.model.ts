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
        updatedOn: Date
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
    }

    paymentAccountId: String;
    name: String;
    code: String;
    bankName: String;
    billCount: String;
    hotelPaymentGateway: HotelPaymentGateway;
    createdBy: String;
    createdOn: Date;
    updatedBy: String;
    updatedOn: Date;
}
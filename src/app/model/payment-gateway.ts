
export class PaymentGateway {
    constructor(
        paymentGatewayId: String,
        baseUrl: String,
        isActive: Boolean,
        merchantId: String,
        merchantKey: String,
        salt: String,
        paymentGatewayName: String,
        createdBy: String,
        createdOn: Date,
        updatedBy: String,
        updatedOn: Date
    ) {
        this.paymentGatewayId = paymentGatewayId;
        this.baseUrl = baseUrl;
        this.isActive = isActive;
        this.merchantId = merchantId;
        this.merchantKey = merchantKey;
        this.salt = salt;
        this.paymentGatewayName = paymentGatewayName;
        this.createdBy = createdBy;
        this.createdOn = createdOn;
        this.updatedBy = updatedBy;
        this.updatedOn = updatedOn;
    }

    paymentGatewayId: String;
    baseUrl: String;
    isActive: Boolean;
    merchantId: String;
    merchantKey: String;
    salt: String;
    paymentGatewayName: String;
    createdBy: String;
    createdOn: Date;
    updatedBy: String;
    updatedOn: Date;
}
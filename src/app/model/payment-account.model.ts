export class PaymentAccount {
    constructor(
        paymentAccountId: String,
        name: String,
        code: String,
        bankName: String,
        billCount: String,
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
    createdBy: String;
    createdOn: Date;
    updatedBy: String;
    updatedOn: Date;
}
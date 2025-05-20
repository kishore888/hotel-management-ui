export class Hotel {
    constructor(
        hotelId: String,
        city: String,
        district: String,
        emailId: String,
        hotelName: String,
        landNo: String,
        phoneNo1: String,
        phoneNo2: String,
        pincode: String,
        state: String,
        street: String,
        currentFinancialYearId: String,
        createdBy: String,
        createdOn: Date,
        updatedBy: String,
        updatedOn: Date
    ) {
        this.hotelId = hotelId;
        this.city = city;
        this.district = district,
        this.emailId = emailId,
        this.hotelName = hotelName,
        this.landNo = landNo;
        this.phoneNo1 = phoneNo1;
        this.phoneNo2 = phoneNo2;
        this.pincode = pincode;
        this.state = state;
        this.street = street;
        this.currentFinancialYearId = currentFinancialYearId;
        this.createdBy = createdBy;
        this.createdOn = createdOn;
        this.updatedBy = updatedBy;
        this.updatedOn = updatedOn;
    }

    hotelId: String;
    city: String;
    district: String;
    emailId: String;
    hotelName: String;
    landNo: String;
    phoneNo1: String;
    phoneNo2: String;
    pincode: String;
    state: String;
    street: String;
    currentFinancialYearId: String;
    createdBy: String;
    createdOn: Date;
    updatedBy: String;
    updatedOn: Date;
}
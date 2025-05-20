export class HotelPlanMaster {
    constructor(
        hotelPlanMasterId: String,
        planCode: String,
        planDescription: String,
        planName: String,
        createdBy: String,
        createdOn: Date,
        updatedBy: String,
        updatedOn: Date
    ) {
        this.hotelPlanMasterId = hotelPlanMasterId;
        this.planCode = planCode;
        this.planDescription = planDescription;
        this.planName = planName;
        this.createdBy = createdBy;
        this.createdOn = createdOn;
        this.updatedBy = updatedBy;
        this.updatedOn = updatedOn;
    }

    hotelPlanMasterId: String;
    planCode: String;
    planDescription: String;
    planName: String;
    createdBy: String;
    createdOn: Date;
    updatedBy: String;
    updatedOn: Date;
}
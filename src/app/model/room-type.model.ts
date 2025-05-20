export class RoomType {
    constructor(
        roomTypeId: String,
        roomType: String,
        roomTypeStatus: String,
        roomTypeTariff: String,
        createdBy: String,
        createdOn: Date,
        updatedBy: String,
        updatedOn: Date
    ) {
        this.roomTypeId = roomTypeId;
        this.roomType = roomType;
        this.roomTypeStatus = roomTypeStatus;
        this.roomTypeTariff = roomTypeTariff;
        this.createdBy = createdBy;
        this.createdOn = createdOn;
        this.updatedBy = updatedBy;
        this.updatedOn = updatedOn;
    }
    roomTypeId: String;
    roomType: String;
    roomTypeStatus: String;
    roomTypeTariff: String;
    createdBy: String;
    createdOn: Date;
    updatedBy: String;
    updatedOn: Date;
}
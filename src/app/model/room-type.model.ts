export class RoomType {
    constructor(
        roomTypeId: String,
        roomType: String,
        roomTypeCode: String,
        roomTypeStatus: String,
        roomTypeTariff: String,
        description: String,
        adultCapacity: number,
        childCapacity: number,
        bedConfiguration: String,
        baseTariff: number,
        weekendTariff: number,
        currency: String,
        taxRate: number,
        minNights: number,
        maxNights: number,
        amenities: String,
        roomSize: number,
        viewType: String,
        smokingPolicy: String,
        accessibility: String,
        category: String,
        tags: String,
        images: String,
        isActive: boolean,
        createdBy: String,
        createdOn: Date,
        updatedBy: String,
        updatedOn: Date
    ) {
        this.roomTypeId = roomTypeId;
        this.roomType = roomType;
        this.roomTypeCode = roomTypeCode;
        this.roomTypeStatus = roomTypeStatus;
        this.roomTypeTariff = roomTypeTariff;
        this.description = description;
        this.adultCapacity = adultCapacity;
        this.childCapacity = childCapacity;
        this.bedConfiguration = bedConfiguration;
        this.baseTariff = baseTariff;
        this.weekendTariff = weekendTariff;
        this.currency = currency;
        this.taxRate = taxRate;
        this.minNights = minNights;
        this.maxNights = maxNights;
        this.amenities = amenities;
        this.roomSize = roomSize;
        this.viewType = viewType;
        this.smokingPolicy = smokingPolicy;
        this.accessibility = accessibility;
        this.category = category;
        this.tags = tags;
        this.images = images;
        this.isActive = isActive;
        this.createdBy = createdBy;
        this.createdOn = createdOn;
        this.updatedBy = updatedBy;
        this.updatedOn = updatedOn;
    }
    roomTypeId: String;
    roomType: String;
    roomTypeCode: String;
    roomTypeStatus: String;
    roomTypeTariff: String;
    description: String;
    adultCapacity: number;
    childCapacity: number;
    bedConfiguration: String;
    baseTariff: number;
    weekendTariff: number;
    currency: String;
    taxRate: number;
    minNights: number;
    maxNights: number;
    amenities: String;
    roomSize: number;
    viewType: String;
    smokingPolicy: String;
    accessibility: String;
    category: String;
    tags: String;
    images: String;
    isActive: boolean;
    createdBy: String;
    createdOn: Date;
    updatedBy: String;
    updatedOn: Date;
}
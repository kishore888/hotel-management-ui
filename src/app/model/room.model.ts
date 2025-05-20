import { HotelPlanMaster } from "./hotel-plan-master.model";
import { Hotel } from "./hotel.model";
import { PaymentAccount } from "./payment-account.model";
import { RoomType } from "./room-type.model";

export class Room{

    constructor(
        roomId: String,
        roomNumber: number,
        roomType: RoomType,
        hotelPlanMaster: HotelPlanMaster,
        maxNoOfAdults: number, 
        roomCharges: number,
        maxNoOfKids: number,
        status: String,
        paymentAccount: PaymentAccount,
        hotel: Hotel,
        createdBy: String,
        createdOn: Date,
        updatedBy: String,
        updatedOn: Date
        
    ) {
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.roomType = roomType;
        this.hotelPlanMaster = hotelPlanMaster;
        this.maxNoOfAdults = maxNoOfAdults;
        this.roomCharges = roomCharges;
        this.maxNoOfKids = maxNoOfKids;
        this.status = status;
        this.paymentAccount = paymentAccount;
        this.hotel = hotel;
        this.createdBy = createdBy;
        this.createdOn = createdOn;
        this.updatedBy = updatedBy;
        this.updatedOn = updatedOn;
    }

    roomId: String;
    roomNumber: number;
    roomType: RoomType;
    hotelPlanMaster: HotelPlanMaster;
    maxNoOfAdults: number; 
    roomCharges: number;
    maxNoOfKids: number;
    status: String;
    paymentAccount: PaymentAccount;
    hotel: Hotel;
    createdBy: String;
    createdOn: Date;
    updatedBy: String;
    updatedOn: Date;
}
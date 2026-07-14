import { HotelPlanMaster } from "./hotel-plan-master.model";
import { Hotel } from "./hotel.model";
import { PaymentAccount } from "./payment-account.model";
import { RoomType } from "./room-type.model";
import { RoomStatus } from "./room-status.model";

export class Room{

    constructor(
        roomId?: String,
        roomNumber?: number,
        roomType?: RoomType,
        hotelPlanMaster?: HotelPlanMaster,
        maxNoOfAdults?: number,
        roomCharges?: number,
        maxNoOfKids?: number,
        status?: String,
        paymentAccount?: PaymentAccount,
        hotel?: Hotel,
        floorNumber?: number,
        roomStatus?: RoomStatus,
        createdBy?: String,
        createdOn?: Date,
        updatedBy?: String,
        updatedOn?: Date

    ) {
        this.roomId = roomId || '';
        this.roomNumber = roomNumber || 0;
        this.roomType = roomType || {} as any;
        this.hotelPlanMaster = hotelPlanMaster || {} as any;
        this.maxNoOfAdults = maxNoOfAdults || 0;
        this.roomCharges = roomCharges || 0;
        this.maxNoOfKids = maxNoOfKids || 0;
        this.status = status || '';
        this.paymentAccount = paymentAccount || {} as any;
        this.hotel = hotel || {} as any;
        this.floorNumber = floorNumber || 0;
        this.roomStatus = roomStatus;
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
    floorNumber: number;
    roomStatus?: RoomStatus;
    createdBy?: String;
    createdOn?: Date;
    updatedBy?: String;
    updatedOn?: Date;
}
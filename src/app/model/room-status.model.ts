export class RoomStatus {
    constructor(
        roomStatusId: String,
        room: any,
        housekeepingStatus: String,
        housekeepingPriority: String,
        maintenanceStatus: boolean,
        maintenanceNotes: String,
        lastCleanedOn: Date,
        lastInspectedOn: Date,
        currentGuestId: String,
        checkInDate: Date,
        checkOutDate: Date,
        isOccupied: boolean,
        isReserved: boolean,
        lockStatus: String,
        specialRequests: String,
        notes: String,
        createdBy: String,
        createdOn: Date,
        updatedBy: String,
        updatedOn: Date
    ) {
        this.roomStatusId = roomStatusId;
        this.room = room;
        this.housekeepingStatus = housekeepingStatus;
        this.housekeepingPriority = housekeepingPriority;
        this.maintenanceStatus = maintenanceStatus;
        this.maintenanceNotes = maintenanceNotes;
        this.lastCleanedOn = lastCleanedOn;
        this.lastInspectedOn = lastInspectedOn;
        this.currentGuestId = currentGuestId;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.isOccupied = isOccupied;
        this.isReserved = isReserved;
        this.lockStatus = lockStatus;
        this.specialRequests = specialRequests;
        this.notes = notes;
        this.createdBy = createdBy;
        this.createdOn = createdOn;
        this.updatedBy = updatedBy;
        this.updatedOn = updatedOn;
    }

    roomStatusId: String;
    room: any;
    housekeepingStatus: String;
    housekeepingPriority: String;
    maintenanceStatus: boolean;
    maintenanceNotes: String;
    lastCleanedOn: Date;
    lastInspectedOn: Date;
    currentGuestId: String;
    checkInDate: Date;
    checkOutDate: Date;
    isOccupied: boolean;
    isReserved: boolean;
    lockStatus: String;
    specialRequests: String;
    notes: String;
    createdBy: String;
    createdOn: Date;
    updatedBy: String;
    updatedOn: Date;
}

import { Component, Input } from '@angular/core';
import { Room } from '../../model/room.model';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RoomType } from '../../model/room-type.model';
import { Subscription } from 'rxjs';
import { RoomTypeService } from '../room-type/room-type.service';
import { PlanMasterService } from '../../hotel/plan-master/plan-master.service';
import { HotelPlanMaster } from '../../model/hotel-plan-master.model';
import { CreateRoomService } from './create-room.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaymentAccountService } from '../../payment/payment-account/payment-account.service';
import { PaymentAccount } from '../../model/payment-account.model';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrl: './create-room.component.css',
  standalone: true,
  imports: [FormsModule, CommonModule]
})
  export class CreateRoomComponent {
    // @Input() room: Room;
    room: Room = new Room();
    roomTypes: RoomType[] = [];
    hotelPlanMasters: HotelPlanMaster[] = [];
    paymentAccounts: PaymentAccount[] = [];
    private roomTypeSubscription: Subscription = new Subscription();

    constructor(private router: Router, private location: Location, private roomTypeService: RoomTypeService,
      private createRoomService: CreateRoomService, private planMasterService: PlanMasterService,
      private paymentAccountService: PaymentAccountService) {
      const navigation = this.router.getCurrentNavigation();
      this.room = navigation?.extras.state?.['room'];
    }
    
    ngOnInit(): void {
      this.getRoomTypes();
      this.getHotelPlans();
      this.getPaymentAccounts();
    }

    getRoomTypes() {
      this.roomTypeSubscription = this.roomTypeService.getRoomTypes().subscribe({
        next: (response) => {
          this.roomTypes = response;
        },
        error: (error) => {
          console.error('Error fetching data', error);
        }
      });
    }

    getHotelPlans() {
      this.roomTypeSubscription = this.planMasterService.getHotelPlans().subscribe({
        next: (response) => {
          this.hotelPlanMasters = response;
        },
        error: (error) => {
          console.error('Error fetching hotelPlanMaster data', error);
        }
      });
    }

    getPaymentAccounts() {
      this.roomTypeSubscription = this.paymentAccountService.getPaymentAccounts().subscribe({
        next: (response) => {
          this.paymentAccounts = response;
        },
        error: (error) => {
          console.error('Error fetching payment account data', error);
        }
      });
    }

    onSubmit(form: any): void {
      console.log('form data: ',form.value);
      const payload: any = {
        roomNumber: form.value.roomNumber,
        roomCharges: form.value.roomCharges,
        maxNoOfAdults: form.value.maxNoOfAdults,
        maxNoOfKids: form.value.maxNoOfKids,
        status: form.value.status,
        floorNumber: form.value.floorNumber,
        hotel: { hotelId: this.room.hotel?.hotelId },
        roomType: { roomTypeId: form.value.roomTypeId },
        hotelPlanMaster: { hotelPlanMasterId: form.value.planId },
        paymentAccount: { paymentAccountId: form.value.paymentAccountId }
      };

      // Include roomId if editing
      if (this.room?.roomId) {
        payload.roomId = this.room.roomId;
      }

      console.log('Sending payload:', payload);
      this.createRoomService.createRoom(payload);
    }

}

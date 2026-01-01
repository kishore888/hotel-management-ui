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

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrl: './create-room.component.css',
  standalone: true,
  imports: [FormsModule]
})
  export class CreateRoomComponent {
    // @Input() room: Room;
    room: Room = {} as Room;
    roomTypes: RoomType[] = [];
    hotelPlanMasters: HotelPlanMaster[] = [];
    private roomTypeSubscription: Subscription = new Subscription();

    constructor(private router: Router, private location: Location, private roomTypeService: RoomTypeService, 
      private createRoomService: CreateRoomService, private planMasterService: PlanMasterService) {
      const navigation = this.router.getCurrentNavigation();
      this.room = navigation?.extras.state?.['room'];
    }
    
    ngOnInit(): void {
      this.getRoomTypes();
      this.getHotelPlans();
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

    onSubmit(form: any): void {
      console.log('form data: ',form.value);
      const payload = {
        ...form.value,
        hotel: { hotelId: this.room.hotel.hotelId },
        //  hotelPlanMaster: { hotelPlanMasterId: form.value.hotelPlanMasterId },
      };

      this.createRoomService.createRoom(payload);
    }

}

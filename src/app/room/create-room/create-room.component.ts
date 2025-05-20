import { Component, input } from '@angular/core';
import { Room } from '../../model/room.model';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RoomType } from '../../model/room-type.model';
import { Subscription } from 'rxjs';
import { RoomTypeService } from '../room-type/room-type.service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrl: './create-room.component.css'
})
  export class CreateRoomComponent {
    room: Room ;
    roomTypes: RoomType[] = [];
    private roomTypeSubscription: Subscription = new Subscription();

    constructor(private router: Router, private location: Location, private roomTypeService: RoomTypeService) {
      const navigation = this.router.getCurrentNavigation();
      this.room = navigation?.extras.state?.['room'];
    }
    
    ngOnInit(): void {
      this.getRoomTypes();
      console.log("Room : "+this.room);
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

    onSubmit(form: any): void {
      console.log('form data: ',form.value);
    }

}

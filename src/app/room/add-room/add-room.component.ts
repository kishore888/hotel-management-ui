import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CarouselModule } from 'primeng/carousel';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { HotelPlanMaster } from '../../model/hotel-plan-master.model';
import { RoomTypeService } from '../room-type/room-type.service';
import { PlanMasterService } from '../../hotel/plan-master/plan-master.service';
import { Observable, Subscription } from 'rxjs';
import { RoomType } from '../../model/room-type.model';
import { Router } from '@angular/router';
import { Room } from '../../model/room.model';
import { AddRoomService } from './add-room.service';
import { PaymentAccountService } from '../../payment/payment-account/payment-account.service';
import { PaymentAccount } from '../../model/payment-account.model';
import { Store } from '@ngrx/store';
import { selectAllRooms, selectHotel } from '../../initialize-app/selectors';
import { Hotel } from '../../model/hotel.model';
import { AppState } from '../../initialize-app/app-state';

@Component({
  selector: 'app-add-room.component',
  imports: [CarouselModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule,
    MatIconModule, CommonModule,
    ReactiveFormsModule,],
  templateUrl: './add-room.component.html',
  styleUrl: './add-room.component.css',
  standalone: true
})

export class AddRoomComponent {
  // roomTypes = ['Standard', 'Deluxe', 'Suite', 'Family'];
  roomTypes: RoomType[] = [];
  hotelPlanMasters: HotelPlanMaster[] = [];
  paymentAccounts: PaymentAccount[] = [];
  room: Room = {} as Room;
  hotel: Hotel | null = null;

  selectedImages: string[] = [];
  private roomTypeSubscription: Subscription = new Subscription();
  private paymentAcSubscription: Subscription = new Subscription();

  //hotel: Observable<Hotel> = this.store.select(selectHotel);
  // hotel$: Observable<Hotel | null>;
  // hotel: Observable<Hotel | null> = this.store.select(selectHotel);
  
  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private roomTypeService: RoomTypeService,
    private planMasterService: PlanMasterService,private router: Router,
    private addRoomService: AddRoomService, private paymentAcService: PaymentAccountService,
    private store: Store<AppState>
  ) { 
    // this.room = (history.state && history.state['room']) ? history.state['room'] : (undefined as any);
    // read nav state (no deprecated Router.getCurrentNavigation())
    const navRoom = (history.state && history.state['room']) ? history.state['room'] : null;
    if (navRoom) {
      this.room = navRoom as Room;
      this.patchFormForEdit(this.room);
    }
  }

  private patchFormForEdit(room: Room): void {
    this.roomForm.patchValue({
      roomNumber: String(room.roomNumber ?? ''),
      roomTypeId: String(room.roomType?.roomTypeId ?? ''),
      planId: String(room.hotelPlanMaster?.hotelPlanMasterId ?? ''),
      roomCharges: room.roomCharges ?? null,
      maxNoOfAdults: room.maxNoOfAdults ?? 1,
      maxNoOfKids: room.maxNoOfKids ?? 0,
      status: String(room.status ?? 'Available'),
      paymentAccountId: String(room.paymentAccount?.paymentAccountId ?? ''),
      // price: room.roomCharges ?? null,?
      image: this.selectedImages
    });

    // if you have stored image URLs in the room object, load them into selectedImages
    if ((room as any).images && Array.isArray((room as any).images)) {
      this.selectedImages = (room as any).images.slice();
      this.roomForm.patchValue({ image: this.selectedImages });
      this.cdr.detectChanges();
    }
  }

  ngOnInit(): void {
    this.store.select(selectHotel).subscribe(hotel => {
      this.hotel = hotel;
      console.log(this.hotel?.hotelName);
    });
    this.getRoomTypes();
    this.getHotelPlans();
    this.getPaymentAccounts();
  }

  getRoomTypes() {
      this.roomTypeSubscription = this.roomTypeService.getRoomTypes().subscribe({
        next: (response) => {
          // schedule assignment to avoid ExpressionChangedAfterItHasBeenCheckedError
          Promise.resolve().then(() => {
            this.roomTypes = response;
            this.cdr.detectChanges();
          });
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
      this.paymentAcSubscription = this.paymentAcService.getPaymentAccounts().subscribe({
        next: (response) => {
          // schedule assignment to avoid ExpressionChangedAfterItHasBeenCheckedError
          Promise.resolve().then(() => {
            this.paymentAccounts = response;
            this.cdr.detectChanges();
          });
        },
        error: (error) => {
          console.error('Error fetching data', error);
        }
      });
  }

  roomForm = this.fb.group({
    roomNumber: ['', Validators.required],
    roomTypeId: ['', Validators.required],
    planId: [''],
    roomCharges: [0, [Validators.required, Validators.min(0)]],
    maxNoOfAdults: [1, [Validators.min(0)]],
    maxNoOfKids: [0, [Validators.min(0)]],
    status: ['Available'],
    paymentAccountId: [''],
    // roomType: ['', Validators.required],
    // price: [null, [Validators.required, Validators.min(100)]],
    image: [this.selectedImages, Validators.required]
  });

  // Handle file input change 
  onFileSelected(event: Event) {
    // const input = event.target as HTMLInputElement; 
    // if (!input.files) return; 
    // this.selectedImages = []; // reset 
    // Array.from(input.files).forEach(file => { 
    //   const reader = new FileReader(); 
    //   reader.onload = () => { 
    //     this.selectedImages.push(reader.result as string); 
    //     this.roomForm.patchValue({ image: this.selectedImages }); 
    //   }; 
    //     reader.readAsDataURL(file); 
    //   }); 
    const input = event.target as HTMLInputElement;
    if (!input?.files || input.files.length === 0) return;

    // clear previous previews if you want replaced selection behavior
    // this.selectedImages.forEach(u => URL.revokeObjectURL(u));
    // this.selectedImages = [];

    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      const url = URL.createObjectURL(file);
      this.selectedImages.push(url);
    }

    // update form control if you store previews in the form
    if ((this as any).roomForm?.patchValue) {
      (this as any).roomForm.patchValue({ image: this.selectedImages });
    }

    // ensure the view updates
    this.cdr.detectChanges();
  }

  submitForm() {
    if (this.roomForm.invalid) return;
    const f = this.roomForm.value;

    const payload: any = {
      roomNumber: f.roomNumber,
      roomCharges: f.roomCharges,
      maxNoOfAdults: f.maxNoOfAdults,
      maxNoOfKids: f.maxNoOfKids,
      status: f.status,
      hotel: {hotelId: this.hotel?.hotelId}, //it has to be dynamic
      // nested objects:
      roomType: { roomTypeId: f.roomTypeId },
      hotelPlanMaster: { hotelPlanMasterId: f.planId },
      paymentAccount: { paymentAccountId: f.paymentAccountId }
    };

    // include roomId when updating
    if (this.room?.roomId) {
      payload.roomId = this.room.roomId;
      // include hotel id if present on existing room
      if (this.room.hotel?.hotelId) {
        payload.hotel = { hotelId: this.room.hotel.hotelId };
      }
      this.addRoomService.addRoom(payload).subscribe({
        next: () => {
          // handle success (navigate / toast)
        },
        error: (err) => {
          console.error('Update failed', err);
        }
      });
    } else {
      // new room: you may need to set hotel id (from context)
      // payload.hotel = { hotelId: SOME_HOTEL_ID };
      this.addRoomService.addRoom(payload).subscribe({
        next: () => {
          // handle success
        },
        error: (err) => {
          console.error('Create failed', err);
        }
      });
    }
  }

  ngOnDestroy(): void {
    // revoke object URLs to prevent memory leaks
    this.selectedImages.forEach(u => { try { URL.revokeObjectURL(u); } catch {} });
  }
}

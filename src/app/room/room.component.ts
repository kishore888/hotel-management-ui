import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Room } from '../model/room.model';
import { Subscription } from 'rxjs';
import { RoomService } from './room.service';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import * as JSOG from 'jsog';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrl: './room.component.css',
  standalone: false
})
export class RoomComponent implements OnInit, OnDestroy{
  private roomSubscription: Subscription = new Subscription();
  roomList: Room[] = [];
  selectAllRooms = false;
  selectedRoomIds: Set<string> = new Set();
  selectedRooms: Room[] = [];
  isBookingModalOpen = false;
  selectedRoom: Room | null = null;
  bookingGuestName = '';
  bookingCheckInDate = '';
  bookingCheckOutDate = '';
  bookingNotes = '';
  isBooking = false;
  bookingMessage = '';
  closeResult = '';

  constructor(private roomService: RoomService, private router: Router, private keycloakService: KeycloakService, private cdr: ChangeDetectorRef) {
    // this.getRooms();
    // roomService.getRooms().subscribe((response) =>{
    //   try{
    //     console.log("Room List data : "+response);
    //   // this.roomList = JSON.parse(response);
    //   } catch(error){

    //   }
    // });

    console.log("constructor");
  }

  ngOnInit(): void {
    this.getRooms();
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd){
    //     this.roomService.getRooms().subscribe({
    //       next: (response) => this.roomList = response,
    //       error: (error) => console.error('Error fetching data', error)
    //     });
    //   }
    // });

    console.log("ngOnInit");
  }

  getRooms(){
    this.roomSubscription = this.roomService.getRooms().subscribe({
      next: (response) => {
        this.roomList  = JSOG.decode(response); //to resolve the circular reference issue

        console.log('rooms : '+JSON.stringify(response))
        console.log('Constructor data : '+this.roomList);
        this.cdr.detectChanges();
        this.initializeDataTable();
      },
      error: (error) => {
        console.error('Error fetching data', error);
        this.initializeDataTable();
      }
    });
    
  }

  initializeDataTable() {
    setTimeout(()=>{ 
      var roomTable = $('#roomList').DataTable({
        'paging'      : true,
        'lengthChange': true,
        'searching'   : true,
        'ordering'    : true,
        'info'        : true,
        'autoWidth'   : false
      //   pagingType: 'full_numbers',
      // pageLength: 5,
      // processing: true,
      // lengthMenu : [5, 10, 25],
      });

      // 	stay at current page of datatable
      var pageNumber = sessionStorage.getItem('pageNumber');
      if(pageNumber != '' && pageNumber != null){
        roomTable.page(parseInt(pageNumber)).draw('page');
        sessionStorage.removeItem('pageNumber');
      }

    }, 1);
  // }, error => console.error(error));
  }

  addRoom(room: Room): void {
    this.router.navigate(['/addRoom'],{state: {room}});
  }

  navigateToReservation(room: Room): void {
    this.router.navigate(['/room/reservation'], { state: { room } });
  }

  toggleSelectAll(): void {
    if (this.selectAllRooms) {
      this.roomList.forEach(room => {
        this.selectedRoomIds.add((room.roomId || '').toString());
      });
    } else {
      this.selectedRoomIds.clear();
    }
    this.updateSelectedRooms();
  }

  updateSelectedRooms(): void {
    this.selectedRooms = this.roomList.filter(room => this.selectedRoomIds.has((room.roomId || '').toString()));
    this.selectAllRooms = this.selectedRooms.length === this.roomList.length && this.roomList.length > 0;
  }

  isRoomSelected(roomId: string): boolean {
    return this.selectedRoomIds.has(roomId?.toString() || '');
  }

  toggleRoomSelection(roomId: string): void {
    const id = roomId?.toString() || '';
    if (this.selectedRoomIds.has(id)) {
      this.selectedRoomIds.delete(id);
    } else {
      this.selectedRoomIds.add(id);
    }
    this.updateSelectedRooms();
  }

  bookSelectedRooms(): void {
    if (this.selectedRooms.length === 0) {
      return;
    }
    this.router.navigate(['/room/reservation'], { state: { rooms: this.selectedRooms } });
  }

  openBookingModal(room: Room): void {
    this.selectedRoom = room;
    this.bookingGuestName = '';
    this.bookingCheckInDate = '';
    this.bookingCheckOutDate = '';
    this.bookingNotes = '';
    this.bookingMessage = '';
    this.isBookingModalOpen = true;
  }

  submitBooking(): void {
    if (!this.selectedRoom) {
      return;
    }

    if (!this.bookingGuestName.trim()) {
      this.bookingMessage = 'Please enter the guest name.';
      return;
    }

    this.isBooking = true;
    this.bookingMessage = '';

    const payload = {
      roomId: this.selectedRoom.roomId,
      guestName: this.bookingGuestName.trim(),
      checkInDate: this.bookingCheckInDate || null,
      checkOutDate: this.bookingCheckOutDate || null,
      notes: this.bookingNotes.trim(),
      status: 'Reserved'
    };

    const selectedRoom = this.selectedRoom;

    this.roomService.bookRoom(payload).subscribe({
      next: () => {
        this.roomList = this.roomList.map((room) => {
          if (room.roomId === selectedRoom?.roomId) {
            return { ...room, status: 'Reserved' };
          }
          return room;
        });

        if (selectedRoom?.roomStatus) {
          selectedRoom.roomStatus.isReserved = true;
          selectedRoom.roomStatus.currentGuestId = payload.guestName;
          selectedRoom.roomStatus.checkInDate = payload.checkInDate ? new Date(payload.checkInDate) : new Date();
          selectedRoom.roomStatus.checkOutDate = payload.checkOutDate ? new Date(payload.checkOutDate) : new Date();
        }

        this.bookingMessage = `Room ${selectedRoom?.roomNumber ?? ''} has been booked successfully.`;
        this.isBooking = false;
        this.isBookingModalOpen = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Booking failed', error);
        this.isBooking = false;
        this.bookingMessage = 'Booking failed. Please try again.';
      }
    });
  }

  closeBookingModal(): void {
    this.isBookingModalOpen = false;
  }
  // openBookingRoom(content: TemplateRef<any>) {
	// 	this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
	// 		(result) => {
	// 			this.closeResult = `Closed with: ${result}`;
	// 		},
	// 		(reason) => {
	// 			this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
	// 		},
	// 	);
	// }

  
  // bookingRoom(event: Event): void {
  //   const target = event.target as HTMLElement;
  //   const dataRoomId = target.getAttribute('data-roomId');
  //   const roomIdElement = document.getElementById('roomId');
  //   if(roomIdElement && dataRoomId) {
  //     roomIdElement.textContent = dataRoomId;
  //   }

  //   // $('#roomNo').text($(this).attr('data-roomno'));
  //   // $('#book-table').find('#amount').text($(this).attr('data-roomcharges'));
  // }


  getUserRoles(): string[] {
    return this.keycloakService.getUserRoles();
  }
  hasPrivilege(privilege: string): boolean {
    console.log('has add room : '+ this.getUserRoles().includes(privilege));
    return this.getUserRoles().includes(privilege);
  }

  ngOnDestroy(): void{
    if(Subscription){
      this.roomSubscription.unsubscribe();
    }
  }
}

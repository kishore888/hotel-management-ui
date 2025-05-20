import { Component, inject, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { Room } from '../model/room.model';
import { RoomType } from '../model/room-type.model';
import { HotelPlanMaster } from '../model/hotel-plan-master.model';
import { PaymentAccount } from '../model/payment-account.model';
import { Hotel } from '../model/hotel.model';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { RoomService } from './room.service';
import { NavigationEnd, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalBootstrapComponent } from '../modal/modal-bootstrap/modal-bootstrap.component';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrl: './room.component.css'
})
export class RoomComponent implements OnInit, OnDestroy{
  private roomSubscription: Subscription = new Subscription();
  roomList: Room[] = [];
  //modal declarations
  // private modalService = inject(NgbModal);
	closeResult = '';

  constructor(private roomService: RoomService, private router: Router, private modalService: NgbModal, private keycloakService: KeycloakService) {
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
        this.roomList = response;
        console.log('Constructor data : '+this.roomList);
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

  bookingRoom(event: Event): void {
    const target = event.target as HTMLElement;
    const dataRoomId = target.getAttribute('data-roomId');
    this.modalService.open(ModalBootstrapComponent);
    console.log("open modal");

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

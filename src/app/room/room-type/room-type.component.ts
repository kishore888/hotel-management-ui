import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoomTypeService } from './room-type.service';
import { Router } from '@angular/router';
import { RoomType } from '../../model/room-type.model';
import { Subscription } from 'rxjs/internal/Subscription';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-room-type',
  templateUrl: './room-type.component.html',
  styleUrl: './room-type.component.css',
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class RoomTypeComponent {

  // roomType: RoomType;
  roomTypeList: RoomType[] = [];
  private roomTypeSubscription: Subscription = new Subscription();

  constructor(private router: Router, private roomTypeService: RoomTypeService) {
      const navigation = this.router.getCurrentNavigation();
      // this.roomType = navigation?.extras.state?.['room'];
  }

  ngOnInit(): void {
    this.getRoomTypes();
    console.log("ngOnInit");
  }

  getRoomTypes(){
    this.roomTypeSubscription = this.roomTypeService.getRoomTypes().subscribe({
      next: (response) => {
        this.roomTypeList = response;
        console.log('roomTypeList : '+JSON.stringify(response))
        console.log('Constructor data : '+this.roomTypeList);
        this.initializeDataTable();
      },
      error: (error) => {
        console.error('Error fetching data', error);
        this.initializeDataTable();
      }
    });
    
  }
  onSubmit(form: any): void {
      this.roomTypeService.createRoomType(form.value,);
  }

  initializeDataTable() {
    setTimeout(()=>{ 
      var roomTable = $('#roomTypeList').DataTable({
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

}

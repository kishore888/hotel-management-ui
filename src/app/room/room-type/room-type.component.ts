import { ChangeDetectorRef, Component } from '@angular/core';
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

  roomType: RoomType = new RoomType('', '', '', '', '', '', 0, 0, '', 0, 0, '', 0, 0, 0, '', 0, '', '', '', '', '', '', true, '', new Date(), '', new Date());
  roomTypeList: RoomType[] = [];
  private roomTypeSubscription: Subscription = new Subscription();
  amenitiesString = '';
  tagsString = '';
  imagesString = '';

  constructor(private router: Router, private roomTypeService: RoomTypeService, private cdr: ChangeDetectorRef) {
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
        this.cdr.detectChanges();
        this.initializeDataTable();
      },
      error: (error) => {
        console.error('Error fetching data', error);
        this.initializeDataTable();
      }
    });

  }
  onSubmit(form: any): void {
      // Backend expects strings for amenities, tags, images (not arrays)
      // Keep as comma-separated strings
      this.roomType.amenities = this.amenitiesString || '';
      this.roomType.tags = this.tagsString || '';
      this.roomType.images = this.imagesString || '';

      // Convert numeric fields to integers to match backend
      this.roomType.adultCapacity = Math.floor(this.roomType.adultCapacity || 0);
      this.roomType.childCapacity = Math.floor(this.roomType.childCapacity || 0);
      this.roomType.baseTariff = Math.floor(this.roomType.baseTariff || 0);
      this.roomType.weekendTariff = Math.floor(this.roomType.weekendTariff || 0);
      this.roomType.taxRate = Math.floor(this.roomType.taxRate || 0);
      this.roomType.minNights = Math.floor(this.roomType.minNights || 0);
      this.roomType.maxNights = Math.floor(this.roomType.maxNights || 0);
      this.roomType.roomSize = Math.floor(this.roomType.roomSize || 0);

      console.log('Sending payload:', this.roomType);

      this.roomTypeService.createRoomType(this.roomType).subscribe({
        next: (response) => {
          console.log('Form submitted successfully', response);
          this.roomType = new RoomType('', '', '', '', '', '', 0, 0, '', 0, 0, '', 0, 0, 0, '', 0, '', '', '', '', '', '', true, '', new Date(), '', new Date());
          this.amenitiesString = '';
          this.tagsString = '';
          this.imagesString = '';
          window.location.reload();
        },
        error: (error) => {
          console.error('Error creating room type', error);
        }
      });
  }

  initializeDataTable() {
    setTimeout(()=> {
      // Destroy existing DataTable instance if it exists
      const table = $('#roomTypeList');
      if (table.hasClass('dataTable')) {
        table.DataTable().destroy();
      }

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

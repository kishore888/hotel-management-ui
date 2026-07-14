import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Employee } from '../model/employee.model';
import { Hotel } from '../model/hotel.model';
import { Store } from '@ngrx/store';
import { AppState } from '../initialize-app/app-state';
import { selectEmployees, selectHotel } from '../initialize-app/selectors';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
  standalone: false
})
export class EmployeeComponent implements OnInit, OnDestroy {

  activeTab        = 'list';
  employeeList:    Employee[] = [];
  hotel:           Hotel | null = null;
  selectedEmployee: Employee | null = null;
  successMessage   = '';

  private storeSub: Subscription = new Subscription();

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.storeSub = new Subscription();
    this.storeSub.add(
      this.store.select(selectHotel).subscribe(hotel => {
        console.log('🏨 Store hotel value:', hotel);
        this.hotel = hotel;
      })
    );
    this.storeSub.add(
      this.store.select(selectEmployees).subscribe(list => {
        this.employeeList = list;
      })
    );
  }

  openAddForm(): void {
    this.selectedEmployee = null;
    this.activeTab = 'create';
  }

  onEditEmployee(emp: Employee): void {
    this.selectedEmployee = emp;
    this.activeTab = 'create';
  }

  onFormSaved(message: string): void {
    this.successMessage = message;
    this.activeTab = 'list';
    this.selectedEmployee = null;
  }

  onFormCancelled(): void {
    this.activeTab = 'list';
    this.selectedEmployee = null;
  }

  onEmployeeDeleted(message: string): void {
    this.successMessage = message;
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}

import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Employee } from '../model/employee.model';
import { EmployeeShiftSchedule } from '../model/employee-shift-schedule.model';
import { EmployeeService } from './employee.service';
import { EmployeeShiftScheduleService } from './employee-shift-schedule.service';
import { KeycloakService } from 'keycloak-angular';
import { Store } from '@ngrx/store';
import { AppState } from '../initialize-app/app-state';
import { selectHotel } from '../initialize-app/selectors';
import { Hotel } from '../model/hotel.model';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
  standalone: false
})
export class EmployeeComponent implements OnInit, OnDestroy {

  employeeList: Employee[] = [];
  filteredEmployees: Employee[] = [];
  selectedEmployee: Employee | null = null;
  isEditMode = false;
  activeTab   = 'list';

  scheduleList: EmployeeShiftSchedule[] = [];
  selectedSchedule: EmployeeShiftSchedule | null = null;
  isScheduleEditMode = false;
  scheduleEmployeeId = '';
  scheduleFrom = '';
  scheduleTo   = '';
  scheduleForm: FormGroup;
  showScheduleForm = false;
  hotel: Hotel | null = null;
  errorMessage = '';
  successMessage = '';
  filterGender = '';
  filterRole    = '';
  filterStatus  = '';

  prefixes     = ['Mr.', 'Mrs.', 'Ms.', 'Dr.', 'Prof.'];
  genders      = ['Male', 'Female', 'Other'];
  religions    = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other'];
  roles        = ['ADMIN', 'MANAGER', 'RECEPTIONIST', 'HOUSEKEEPING', 'MAINTENANCE', 'RESTAURANT', 'SECURITY'];
  departments  = ['FRONT_DESK', 'HOUSEKEEPING', 'FOOD_BEVERAGE', 'MAINTENANCE', 'SECURITY', 'ADMINISTRATION'];
  shifts       = ['MORNING', 'AFTERNOON', 'NIGHT'];
  statuses     = ['ACTIVE', 'INACTIVE', 'ON_LEAVE'];

  private employeeSubscription: Subscription = new Subscription();
  employeeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private shiftScheduleService: EmployeeShiftScheduleService,
    private modalService: NgbModal,
    private keycloakService: KeycloakService,
    private cdr: ChangeDetectorRef,
    private store: Store<AppState>
  ) {
    this.employeeForm = this.fb.group({
      firstName:             ['', Validators.required],
      lastName:              ['', Validators.required],
      prefix:                [''],
      gender:                [''],
      qualification:         [''],
      maritalStatus:         [false],
      fatherName:            [''],
      religion:              [''],
      panNumber:             [''],
      emailId:               ['', Validators.email],
      correspondenceAddress: [''],
      curStreet:             [''],
      curCity:               [''],
      curState:              [''],
      permanentAddress:      [''],
      permntStreet:          [''],
      permntCity:            [''],
      permntState:           [''],
      drivingLicenceNo:      [''],
      audharCardNo:          [''],
      voterId:               [''],
      passportNo:            [''],
      image:                 [''],
      phone:                 ['', Validators.required],
      role:                  ['', Validators.required],
      department:            ['', Validators.required],
      salary:                [0, [Validators.required, Validators.min(0)]],
      joiningDate:           [''],
      status:                ['ACTIVE']
    });

    this.scheduleForm = this.fb.group({
      shiftDate:      ['', Validators.required],
      shift:          ['', Validators.required],
      shiftStartTime: [''],
      shiftEndTime:   [''],
      notes:          ['']
    });
  }

  ngOnInit(): void {
    this.store.select(selectHotel).subscribe(hotel => {
      console.log('🏨 Store hotel value:', hotel);
      this.hotel = hotel;
      if (hotel?.hotelId) {
        this.getEmployees(String(hotel.hotelId));
      }
    });
  }

  getEmployees(hotelId: string): void {
    this.employeeSubscription = this.employeeService.getEmployees(hotelId).subscribe({
      next: (response) => {
        this.employeeList = response;
        this.applyFilters();
        this.cdr.detectChanges();
        this.initializeDataTable();
      },
      error: (err) => {
        console.error('Error fetching employees', err);
        this.employeeList = [];
        this.filteredEmployees = [];
        this.initializeDataTable();
      }
    });
  }

  initializeDataTable(): void {
    setTimeout(() => {
      if (($ as any).fn.dataTable.isDataTable('#employeeTable')) {
        $('#employeeTable').DataTable().destroy();
      }
      var employeeTable = $('#employeeTable').DataTable({
        'paging'      : true,
        'lengthChange': true,
        'searching'   : true,
        'ordering'    : true,
        'info'        : true,
        'autoWidth'   : false,
        columnDefs: [{ targets: '_all', defaultContent: '' }]
      });

      $('#employeeTable').on('page.dt', function () {
        var info = employeeTable.page.info();
        sessionStorage.setItem('empPageNumber', String(info.page));
      });

      var pageNumber = sessionStorage.getItem('empPageNumber');
      if (pageNumber != null && pageNumber !== '') {
        employeeTable.page(parseInt(pageNumber)).draw('page');
        sessionStorage.removeItem('empPageNumber');
      }
    }, 1);
  }

  applyFilters(): void {
    this.filteredEmployees = this.employeeList.filter(emp => {
      return (!this.filterGender || emp.gender === this.filterGender) &&
             (!this.filterRole   || emp.role   === this.filterRole)   &&
             (!this.filterStatus || emp.status === this.filterStatus);
    });
    this.initializeDataTable();
  }

  openAddForm(): void {
    this.isEditMode = false;
    this.selectedEmployee = null;
    this.employeeForm.reset({ maritalStatus: false, salary: 0, status: 'ACTIVE' });
    this.errorMessage = '';
    this.activeTab = 'create';
  }

  openEditForm(employee: Employee): void {
    this.isEditMode = true;
    this.selectedEmployee = employee;
    this.errorMessage = '';
    this.employeeForm.patchValue({
      firstName:             employee.firstName,
      lastName:              employee.lastName,
      prefix:                employee.prefix,
      gender:                employee.gender,
      qualification:         employee.qualification,
      maritalStatus:         employee.maritalStatus,
      fatherName:            employee.fatherName,
      religion:              employee.religion,
      panNumber:             employee.panNumber,
      emailId:               employee.emailId,
      correspondenceAddress: employee.correspondenceAddress,
      curStreet:             employee.curStreet,
      curCity:               employee.curCity,
      curState:              employee.curState,
      permanentAddress:      employee.permanentAddress,
      permntStreet:          employee.permntStreet,
      permntCity:            employee.permntCity,
      permntState:           employee.permntState,
      drivingLicenceNo:      employee.drivingLicenceNo,
      audharCardNo:          employee.audharCardNo,
      voterId:               employee.voterId,
      passportNo:            employee.passportNo,
      image:                 employee.image,
      phone:                 employee.phone,
      role:                  employee.role,
      department:            employee.department,
      salary:                employee.salary,
      joiningDate:           employee.joiningDate,
      status:                employee.status
    });
    this.activeTab = 'create';
  }

  cancelForm(): void {
    this.isEditMode = false;
    this.selectedEmployee = null;
    this.employeeForm.reset({ maritalStatus: false, salary: 0, status: 'ACTIVE' });
    this.errorMessage = '';
    this.activeTab = 'list';
    this.initializeDataTable();
  }

  loadSchedule(): void {
    if (!this.scheduleEmployeeId) return;
    const obs = (this.scheduleFrom && this.scheduleTo)
      ? this.shiftScheduleService.getByDateRange(this.scheduleEmployeeId, this.scheduleFrom, this.scheduleTo)
      : this.shiftScheduleService.getByEmployee(this.scheduleEmployeeId);
    obs.subscribe({
      next: (data) => { this.scheduleList = data; },
      error: (err) => { console.error('Error loading schedule', err); this.scheduleList = []; }
    });
  }

  openAddScheduleForm(): void {
    this.isScheduleEditMode = false;
    this.selectedSchedule = null;
    this.scheduleForm.reset();
    this.showScheduleForm = true;
  }

  openEditScheduleForm(schedule: EmployeeShiftSchedule): void {
    this.isScheduleEditMode = true;
    this.selectedSchedule = schedule;
    this.scheduleForm.patchValue({
      shiftDate:      schedule.shiftDate,
      shift:          schedule.shift,
      shiftStartTime: schedule.shiftStartTime,
      shiftEndTime:   schedule.shiftEndTime,
      notes:          schedule.notes
    });
    this.showScheduleForm = true;
  }

  cancelScheduleForm(): void {
    this.isScheduleEditMode = false;
    this.selectedSchedule = null;
    this.scheduleForm.reset();
    this.showScheduleForm = false;
  }

  submitScheduleForm(): void {
    if (this.scheduleForm.invalid) {
      this.scheduleForm.markAllAsTouched();
      return;
    }
    const payload: any = {
      ...this.scheduleForm.value,
      employee: { employeeId: this.scheduleEmployeeId }
    };
    if (this.isScheduleEditMode && this.selectedSchedule) {
      payload.shiftScheduleId = this.selectedSchedule.shiftScheduleId;
      this.shiftScheduleService.update(payload).subscribe({
        next: () => { this.cancelScheduleForm(); this.loadSchedule(); },
        error: (err) => console.error('Schedule update failed', err)
      });
    } else {
      this.shiftScheduleService.create(payload).subscribe({
        next: () => { this.cancelScheduleForm(); this.loadSchedule(); },
        error: (err) => console.error('Schedule create failed', err)
      });
    }
  }

  confirmDeleteSchedule(schedule: EmployeeShiftSchedule): void {
    if (!confirm(`Delete shift on ${schedule.shiftDate}?`)) return;
    this.shiftScheduleService.delete(schedule.shiftScheduleId).subscribe({
      next: () => { this.loadSchedule(); },
      error: (err) => console.error('Schedule delete failed', err)
    });
  }

  submitForm(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }
    const f = this.employeeForm.value;
    const payload: any = {
      ...f,
      hotel: { hotelId: this.hotel?.hotelId }
    };

    if (this.isEditMode && this.selectedEmployee) {
      payload.employeeId = this.selectedEmployee.employeeId;
      this.employeeService.updateEmployee(payload).subscribe({
        next: () => {
          this.successMessage = 'Employee updated successfully.';
          this.cancelForm();
          this.getEmployees(String(this.hotel?.hotelId));
        },
        error: (err) => { this.errorMessage = 'Update failed. Please try again.'; console.error(err); }
      });
    } else {
      this.employeeService.createEmployee(payload).subscribe({
        next: () => {
          this.successMessage = 'Employee created successfully.';
          this.cancelForm();
          this.getEmployees(String(this.hotel?.hotelId));
        },
        error: (err) => { this.errorMessage = 'Create failed. Please try again.'; console.error(err); }
      });
    }
  }

  openDeleteConfirm(content: TemplateRef<any>, employee: Employee): void {
    this.selectedEmployee = employee;
    this.modalService.open(content, { size: 'sm', backdrop: 'static' });
  }

  confirmDelete(modal: any): void {
    if (!this.selectedEmployee) return;
    this.employeeService.deleteEmployee(this.selectedEmployee.employeeId).subscribe({
      next: () => {
        modal.close();
        this.successMessage = 'Employee deleted successfully.';
        this.getEmployees(String(this.hotel?.hotelId));
      },
      error: (err) => { console.error('Delete failed', err); }
    });
  }

  getGenderClass(gender: string): string {
    switch (gender) {
      case 'Male':   return 'badge bg-primary';
      case 'Female': return 'badge bg-info text-dark';
      default:       return 'badge bg-secondary';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIVE':   return 'badge bg-success';
      case 'INACTIVE': return 'badge bg-danger';
      case 'ON_LEAVE': return 'badge bg-warning text-dark';
      default:         return 'badge bg-secondary';
    }
  }

  getShiftClass(shift: string): string {
    switch (shift) {
      case 'MORNING':   return 'badge bg-info text-dark';
      case 'AFTERNOON': return 'badge bg-warning text-dark';
      case 'NIGHT':     return 'badge bg-dark';
      default:          return 'badge bg-secondary';
    }
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'ADMIN':        return 'badge bg-danger';
      case 'MANAGER':      return 'badge bg-primary';
      case 'RECEPTIONIST': return 'badge bg-info text-dark';
      case 'HOUSEKEEPING': return 'badge bg-secondary';
      case 'MAINTENANCE':  return 'badge bg-warning text-dark';
      case 'RESTAURANT':   return 'badge bg-success';
      case 'SECURITY':     return 'badge bg-dark';
      default:             return 'badge bg-secondary';
    }
  }


  getUserRoles(): string[] {
    return this.keycloakService.getUserRoles();
  }

  hasPrivilege(privilege: string): boolean {
    return this.getUserRoles().includes(privilege);
  }

  ngOnDestroy(): void {
    this.employeeSubscription.unsubscribe();
  }
}

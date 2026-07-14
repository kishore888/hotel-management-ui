import { Component, EventEmitter, NgZone, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KeycloakService } from 'keycloak-angular';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Employee } from '../../model/employee.model';
import { EmployeeService } from '../employee.service';
import { AppState } from '../../initialize-app/app-state';
import { selectEmployees } from '../../initialize-app/selectors';
import { removeEmployee } from '../../initialize-app/actions';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  standalone: false
})
export class EmployeeListComponent implements OnInit, OnDestroy {

  @Output() editEmployee    = new EventEmitter<Employee>();
  @Output() employeeDeleted = new EventEmitter<string>();

  private allEmployees:  Employee[] = [];
  filteredEmployees:     Employee[] = [];
  selectedEmployee:      Employee | null = null;

  filterGender = '';
  filterRole   = '';
  filterStatus = '';

  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;

  private storeSub: Subscription = new Subscription();

  readonly genders  = ['Male', 'Female', 'Other'];
  readonly roles    = ['ADMIN', 'MANAGER', 'RECEPTIONIST', 'HOUSEKEEPING', 'MAINTENANCE', 'RESTAURANT', 'SECURITY'];
  readonly statuses = ['ACTIVE', 'INACTIVE', 'ON_LEAVE'];

  constructor(
    private employeeService: EmployeeService,
    private modalService: NgbModal,
    private keycloakService: KeycloakService,
    private store: Store<AppState>,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.storeSub = this.store.select(selectEmployees).subscribe(employees => {
      this.allEmployees = employees;
      this.applyFilters();
    });
  }

  applyFilters(): void {
    this.filteredEmployees = this.allEmployees.filter(emp =>
      (!this.filterGender || emp.gender   === this.filterGender) &&
      (!this.filterRole   || emp.role     === this.filterRole)   &&
      (!this.filterStatus || emp.status   === this.filterStatus)
    );
    this.initializeDataTable();
  }

  clearFilters(): void {
    this.filterGender = '';
    this.filterRole   = '';
    this.filterStatus = '';
    this.applyFilters();
  }

  initializeDataTable(): void {
    if (($ as any).fn.dataTable.isDataTable('#employeeTable')) {
      ($('#employeeTable') as any).DataTable().destroy();
      ($('#employeeTable tbody') as any).empty();
    }

    const self = this;
    const table = ($('#employeeTable') as any).DataTable({
      data: this.filteredEmployees,
      paging: true, lengthChange: true, searching: true,
      ordering: true, info: true, autoWidth: false,
      columns: [
        { data: null, render: (_: any, __: any, ___: any, meta: any) => meta.row + 1 },
        { data: null, render: (_: any, __: any, row: Employee) =>
            `${row.prefix || ''} ${row.firstName} ${row.lastName}`.trim() },
        { data: 'phone',  defaultContent: '' },
        { data: 'role',   defaultContent: '',
          render: (d: string) => `<span class="${self.getRoleClass(d)}">${d}</span>` },
        { data: 'department',  defaultContent: '' },
        { data: 'salary',      defaultContent: '' },
        { data: 'joiningDate', defaultContent: '' },
        { data: 'status', defaultContent: '',
          render: (d: string) => `<span class="${self.getStatusClass(d)}">${d}</span>` },
        { data: 'gender', defaultContent: '',
          render: (d: string) => `<span class="${self.getGenderClass(d)}">${d}</span>` },
        { data: 'emailId', defaultContent: '' },
        { data: null, orderable: false,
          render: (_: any, __: any, row: Employee) => {
            if (!self.hasPrivilege('MANAGE_EMPLOYEE')) return '';
            return `<button class="btn btn-success btn-sm me-1 dt-edit" data-id="${row.employeeId}">
                      <i class="bi bi-pencil-fill"></i></button>
                    <button class="btn btn-danger btn-sm dt-delete" data-id="${row.employeeId}">
                      <i class="bi bi-trash-fill"></i></button>`;
          }
        }
      ]
    });

    ($('#employeeTable tbody') as any)
      .off('click', '.dt-edit').on('click', '.dt-edit', function (this: HTMLElement) {
        const id = $(this).data('id');
        const emp = self.filteredEmployees.find(e => e.employeeId === id);
        if (emp) self.ngZone.run(() => self.editEmployee.emit(emp));
      })
      .off('click', '.dt-delete').on('click', '.dt-delete', function (this: HTMLElement) {
        const id = $(this).data('id');
        const emp = self.filteredEmployees.find(e => e.employeeId === id);
        if (emp) self.ngZone.run(() => self.openDeleteConfirm(self.deleteModal, emp));
      });

    ($('#employeeTable') as any).on('page.dt', () => {
      sessionStorage.setItem('empPageNumber', String(table.page.info().page));
    });
    const saved = sessionStorage.getItem('empPageNumber');
    if (saved) { table.page(parseInt(saved)).draw('page'); sessionStorage.removeItem('empPageNumber'); }
  }

  openDeleteConfirm(content: TemplateRef<any>, employee: Employee): void {
    this.selectedEmployee = employee;
    this.modalService.open(content, { size: 'sm', backdrop: 'static' });
  }

  confirmDelete(modal: any): void {
    if (!this.selectedEmployee) return;
    const id = this.selectedEmployee.employeeId;
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        modal.close();
        this.store.dispatch(removeEmployee({ employeeId: id }));
        this.employeeDeleted.emit('Employee deleted successfully.');
      },
      error: (err) => console.error('Delete failed', err)
    });
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }

  hasPrivilege(privilege: string): boolean {
    return this.keycloakService.getUserRoles().includes(privilege);
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
}

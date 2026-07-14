import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KeycloakService } from 'keycloak-angular';
import { Employee } from '../../model/employee.model';
import { EmployeeShiftSchedule } from '../../model/employee-shift-schedule.model';
import { EmployeeShiftScheduleService } from '../employee-shift-schedule.service';

@Component({
  selector: 'app-employee-shift-schedule',
  templateUrl: './employee-shift-schedule.component.html',
  standalone: false
})
export class EmployeeShiftScheduleComponent {

  @Input() employees: Employee[] = [];

  scheduleList:       EmployeeShiftSchedule[] = [];
  selectedSchedule:   EmployeeShiftSchedule | null = null;
  isScheduleEditMode  = false;
  scheduleEmployeeId  = '';
  scheduleFrom        = '';
  scheduleTo          = '';
  showScheduleForm    = false;
  scheduleForm:       FormGroup;

  readonly shifts = ['MORNING', 'AFTERNOON', 'NIGHT'];

  constructor(
    private fb: FormBuilder,
    private shiftScheduleService: EmployeeShiftScheduleService,
    private keycloakService: KeycloakService
  ) {
    this.scheduleForm = this.fb.group({
      shiftDate:      ['', Validators.required],
      shift:          ['', Validators.required],
      shiftStartTime: [''],
      shiftEndTime:   [''],
      notes:          ['']
    });
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
      next: () => this.loadSchedule(),
      error: (err) => console.error('Schedule delete failed', err)
    });
  }

  hasPrivilege(privilege: string): boolean {
    return this.keycloakService.getUserRoles().includes(privilege);
  }

  getShiftClass(shift: string): string {
    switch (shift) {
      case 'MORNING':   return 'badge bg-info text-dark';
      case 'AFTERNOON': return 'badge bg-warning text-dark';
      case 'NIGHT':     return 'badge bg-dark';
      default:          return 'badge bg-secondary';
    }
  }
}

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Employee } from '../../model/employee.model';
import { Hotel } from '../../model/hotel.model';
import { FieldConfig } from '../../model/form-config.model';
import { EmployeeService } from '../employee.service';
import { AppState } from '../../initialize-app/app-state';
import { upsertEmployee } from '../../initialize-app/actions';
import { selectFormConfig } from '../../initialize-app/selectors';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  standalone: false
})
export class EmployeeFormComponent implements OnInit, OnChanges, OnDestroy {

  @Input() employee: Employee | null = null;
  @Input() hotel: Hotel | null = null;
  @Output() saved     = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();

  employeeForm!: FormGroup;
  isEditMode    = false;
  errorMessage  = '';
  fieldConfigs: FieldConfig[] = [];

  private configSub = new Subscription();

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.configSub = this.store.select(selectFormConfig('employee')).subscribe(fields => {
      if (fields.length > 0) {
        this.fieldConfigs = [...fields].sort((a, b) => a.fieldOrder - b.fieldOrder);
      } else {
        this.fieldConfigs = this.defaultFields();
      }
      this.buildForm();
      if (this.employee) this.employeeForm.patchValue({ ...this.employee });
    });
  }

  private buildForm(): void {
    const group: { [key: string]: any } = {};
    this.fieldConfigs.forEach(f => {
      const validators: any[] = [];
      if (f.required)     validators.push(Validators.required);
      if (f.maxLength)    validators.push(Validators.maxLength(f.maxLength));
      if (f.patternRegex) validators.push(Validators.pattern(f.patternRegex));
      let defaultVal: any = f.fieldType === 'checkbox' ? false
                           : f.fieldType === 'number'   ? null
                           : f.fieldName === 'status'   ? 'ACTIVE' : '';
      group[f.fieldName] = [defaultVal, validators];
    });
    this.employeeForm = this.fb.group(group);
  }

  private defaultFields(): FieldConfig[] {
    return [
      { fieldName:'firstName',   label:'First Name',   fieldType:'text',   visible:true, required:true,  fieldOrder:1,  entityType:'employee' },
      { fieldName:'lastName',    label:'Last Name',    fieldType:'text',   visible:true, required:true,  fieldOrder:2,  entityType:'employee' },
      { fieldName:'prefix',      label:'Prefix',       fieldType:'select', visible:true, required:false, fieldOrder:3,  fieldOptions:'Mr.,Mrs.,Ms.,Dr.,Prof.', entityType:'employee' },
      { fieldName:'gender',      label:'Gender',       fieldType:'select', visible:true, required:false, fieldOrder:4,  fieldOptions:'Male,Female,Other', entityType:'employee' },
      { fieldName:'emailId',     label:'Email',        fieldType:'text',   visible:true, required:false, fieldOrder:5,  entityType:'employee' },
      { fieldName:'phone',       label:'Phone',        fieldType:'text',   visible:true, required:true,  fieldOrder:6,  entityType:'employee' },
      { fieldName:'role',        label:'Role',         fieldType:'select', visible:true, required:true,  fieldOrder:7,  fieldOptions:'ADMIN,MANAGER,RECEPTIONIST,HOUSEKEEPING,MAINTENANCE,RESTAURANT,SECURITY', entityType:'employee' },
      { fieldName:'department',  label:'Department',   fieldType:'select', visible:true, required:false, fieldOrder:8,  fieldOptions:'FRONT_DESK,HOUSEKEEPING,FOOD_BEVERAGE,MAINTENANCE,SECURITY,ADMINISTRATION', entityType:'employee' },
      { fieldName:'salary',      label:'Salary (₹)',   fieldType:'number', visible:true, required:false, fieldOrder:9,  entityType:'employee' },
      { fieldName:'joiningDate', label:'Joining Date', fieldType:'date',   visible:true, required:false, fieldOrder:10, entityType:'employee' },
      { fieldName:'status',      label:'Status',       fieldType:'select', visible:true, required:false, fieldOrder:11, fieldOptions:'ACTIVE,INACTIVE,ON_LEAVE', entityType:'employee' },
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee'] && this.employeeForm) {
      this.errorMessage = '';
      if (this.employee) {
        this.isEditMode = true;
        this.employeeForm.patchValue({ ...this.employee });
      } else {
        this.isEditMode = false;
        this.employeeForm.reset({ maritalStatus: false, salary: null, status: 'ACTIVE' });
      }
    }
  }

  submitForm(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }
    const payload: any = {
      ...this.employeeForm.value,
      hotel: { hotelId: this.hotel?.hotelId }
    };
    if (this.isEditMode && this.employee) {
      payload.employeeId = this.employee.employeeId;
      this.employeeService.updateEmployee(payload).subscribe({
        next: (updated) => {
          this.store.dispatch(upsertEmployee({ employee: updated }));
          this.saved.emit('Employee updated successfully.');
        },
        error: (err) => { this.errorMessage = 'Update failed. Please try again.'; console.error(err); }
      });
    } else {
      this.employeeService.createEmployee(payload).subscribe({
        next: (created) => {
          this.store.dispatch(upsertEmployee({ employee: created }));
          this.saved.emit('Employee created successfully.');
        },
        error: (err) => { this.errorMessage = 'Create failed. Please try again.'; console.error(err); }
      });
    }
  }

  cancel(): void {
    this.cancelled.emit();
  }

  get visibleFields(): FieldConfig[] {
    return this.fieldConfigs.filter(f => f.visible);
  }

  ngOnDestroy(): void {
    this.configSub.unsubscribe();
  }
}

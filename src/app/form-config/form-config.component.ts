import { Component, OnDestroy, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { FieldConfig } from '../model/form-config.model';
import { AppState } from '../initialize-app/app-state';
import { selectFormConfig, selectHotel } from '../initialize-app/selectors';
import { loadFormConfigSuccess, saveFormConfigSuccess } from '../initialize-app/actions';
import { FormConfigService } from './form-config.service';

@Component({
  selector: 'app-form-config',
  templateUrl: './form-config.component.html',
  styleUrls: ['./form-config.component.css'],
  standalone: false
})
export class FormConfigComponent implements OnInit, OnDestroy {

  readonly entityTypes = [
    { value: 'employee', label: 'Employee' }
  ];
  entityType   = 'employee';
  fields:      FieldConfig[] = [];
  hotelId      = '';
  saveSuccess  = false;
  saveError    = '';
  saving       = false;
  loading      = false;

  private subs = new Subscription();

  constructor(
    private store: Store<AppState>,
    private formConfigService: FormConfigService
  ) {}

  ngOnInit(): void {
    this.subs.add(
      this.store.select(selectHotel).subscribe(hotel => {
        if (hotel) {
          this.hotelId = String(hotel.hotelId ?? '');
          this.loadFields();
        }
      })
    );
  }

  onEntityTypeChange(): void {
    this.fields = [];
    this.saveSuccess = false;
    this.saveError = '';
    this.loadFields();
  }

  loadFields(): void {
    if (!this.hotelId) return;
    this.store.select(selectFormConfig(this.entityType)).pipe(take(1)).subscribe(storeFields => {
      if (storeFields.length > 0) {
        this.fields = storeFields.map(f => ({ ...f })).sort((a, b) => a.fieldOrder - b.fieldOrder);
      } else {
        this.loading = true;
        this.formConfigService.getConfig(this.hotelId, this.entityType).subscribe({
          next: (apiFields) => {
            this.loading = false;
            this.fields  = [...apiFields].sort((a, b) => a.fieldOrder - b.fieldOrder);
            this.store.dispatch(loadFormConfigSuccess({ entityType: this.entityType, fields: apiFields }));
          },
          error: () => { this.loading = false; }
        });
      }
    });
  }

  drop(event: CdkDragDrop<FieldConfig[]>): void {
    moveItemInArray(this.fields, event.previousIndex, event.currentIndex);
    this.fields.forEach((f, i) => f.fieldOrder = i + 1);
  }

  moveUp(index: number): void {
    if (index === 0) return;
    moveItemInArray(this.fields, index, index - 1);
    this.fields.forEach((f, i) => f.fieldOrder = i + 1);
  }

  moveDown(index: number): void {
    if (index === this.fields.length - 1) return;
    moveItemInArray(this.fields, index, index + 1);
    this.fields.forEach((f, i) => f.fieldOrder = i + 1);
  }

  save(): void {
    this.saving     = true;
    this.saveSuccess = false;
    this.saveError   = '';
    const payload   = this.fields.map(f => ({
      configId: f.configId,
      fieldName: f.fieldName,
      label: f.label,
      fieldType: f.fieldType,
      visible: f.visible,
      required: f.required,
      fieldOrder: f.fieldOrder,
      maxLength: f.maxLength,
      patternRegex: f.patternRegex,
      patternMessage: f.patternMessage,
      fieldOptions: f.fieldOptions,
      entityType: f.entityType,
      hotel: { hotelId: this.hotelId }
    }));
    // this.formConfigService.saveConfig(this.hotelId, this.entityType, payload).subscribe({
    this.formConfigService.saveConfig(payload).subscribe({
      next: () => {
        this.saving      = false;
        this.saveSuccess = true;
        this.store.dispatch(saveFormConfigSuccess({ entityType: this.entityType, fields: this.fields }));
      },
      error: (err) => {
        this.saving    = false;
        this.saveError = 'Save failed. Please try again.';
        console.error(err);
      }
    });
  }

  getOptionsArray(f: FieldConfig): string[] {
    return f.fieldOptions ? f.fieldOptions.split(',').map(o => o.trim()) : [];
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}

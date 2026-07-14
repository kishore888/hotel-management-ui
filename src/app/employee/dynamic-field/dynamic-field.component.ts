import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FieldConfig } from '../../model/form-config.model';

@Component({
  selector: 'app-dynamic-field',
  templateUrl: './dynamic-field.component.html',
  standalone: false
})
export class DynamicFieldComponent {
  @Input() field!: FieldConfig;
  @Input() form!: FormGroup;

  get control() {
    return this.form.get(this.field.fieldName);
  }

  get optionsList(): string[] {
    return this.field.fieldOptions
      ? this.field.fieldOptions.split(',').map(o => o.trim())
      : [];
  }

  get isInvalid(): boolean {
    const ctrl = this.control;
    return !!(ctrl && ctrl.invalid && ctrl.touched);
  }

  get errorMessage(): string {
    const ctrl = this.control;
    if (!ctrl || !ctrl.errors) return '';
    if (ctrl.errors['required'])   return `${this.field.label} is required.`;
    if (ctrl.errors['maxlength'])  return `Max ${this.field.maxLength} characters allowed.`;
    if (ctrl.errors['pattern'])    return this.field.patternMessage || 'Invalid format.';
    if (ctrl.errors['email'])      return 'Enter a valid email address.';
    return 'Invalid value.';
  }
}

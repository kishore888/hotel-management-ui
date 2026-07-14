import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { HOTEL_CREATOR_ROLE } from '../../keycloak-angular-module/RoleGuard';
import { CreateHotelService } from './create-hotel.service';

@Component({
  selector: 'app-create-hotel',
  templateUrl: './create-hotel.component.html',
  styleUrl: './create-hotel.component.css',
  standalone: false
})
export class CreateHotelComponent implements OnInit {
  hotelForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';
  isAuthorized = false;
  loggedInUser = '';

  readonly indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli',
    'Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  constructor(
    private fb: FormBuilder,
    private createHotelService: CreateHotelService,
    private router: Router,
    private keycloak: KeycloakService
  ) {
    this.hotelForm = this.fb.group({
      hotelName:               ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      emailId:                 ['', [Validators.required, Validators.email, Validators.maxLength(45)]],
      phoneNo1:                ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$'), Validators.maxLength(12)]],
      phoneNo2:                ['', [Validators.pattern('^[6-9]\\d{9}$'), Validators.maxLength(12)]],
      landNo:                  ['', Validators.maxLength(12)],
      street:                  ['', [Validators.required, Validators.maxLength(45)]],
      city:                    ['', [Validators.required, Validators.maxLength(45)]],
      district:                ['', [Validators.required, Validators.maxLength(45)]],
      state:                   ['', Validators.required],
      pincode:                 ['', [Validators.required, Validators.pattern('^[1-9][0-9]{5}$'), Validators.maxLength(8)]],
      currentFinancialYearId:  ['', Validators.maxLength(36)],
      createdBy:               ['', Validators.maxLength(100)],
    });
  }

  ngOnInit(): void {
    this.isAuthorized = this.keycloak.isUserInRole(HOTEL_CREATOR_ROLE);
    if (this.isAuthorized) {
      const profile = this.keycloak.getKeycloakInstance().tokenParsed;
      this.loggedInUser = profile?.['preferred_username'] ?? profile?.['email'] ?? 'SUPER_ADMIN';
      this.hotelForm.patchValue({ createdBy: this.loggedInUser });
    }
  }

  get f() { return this.hotelForm.controls; }

  onSubmit(): void {
    if (this.hotelForm.invalid) {
      this.hotelForm.markAllAsTouched();
      Object.keys(this.hotelForm.controls).forEach(key => {
        const ctrl = this.hotelForm.get(key);
        if (ctrl?.invalid) {
          console.warn(`❌ Invalid field: "${key}"`, ctrl.errors);
        }
      });
      return;
    }
    const email = this.hotelForm.get('emailId')?.value ?? 'SYSTEM';
    this.hotelForm.patchValue({ createdBy: email });
    this.isSubmitting = true;
    this.submitError = '';
    this.createHotelService.createHotel(this.hotelForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = true;
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitError = err?.error?.message ?? 'Registration failed. Please try again.';
      }
    });
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}

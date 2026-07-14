import { ChangeDetectorRef, Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HotelPlanService } from './hotel-plan.service';
import { HotelPlanMaster } from '../../model/hotel-plan-master.model';

@Component({
  selector: 'app-hotel-plan',
  standalone: false,
  templateUrl: './hotel-plan.component.html',
  styleUrl: './hotel-plan.component.css'
})
export class HotelPlanComponent {
  plan: HotelPlanMaster = new HotelPlanMaster('', '', '', '', '', new Date(), '', new Date());
  isSubmitting = false;

  constructor(
    private hotelPlanService: HotelPlanService,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.cdr.detectChanges();

    const payload = {
      planCode: this.plan.planCode,
      planDescription: this.plan.planDescription,
      planName: this.plan.planName
    };

    this.hotelPlanService.createHotelPlan(payload).subscribe({
      next: () => {
        form.resetForm();
        this.plan = new HotelPlanMaster('', '', '', '', '', new Date(), '', new Date());
        this.isSubmitting = false;
        this.cdr.detectChanges();
      },
      error: (error: unknown) => {
        console.error('Error creating hotel plan', error);
        this.isSubmitting = false;
        this.cdr.detectChanges();
      }
    });
  }
}

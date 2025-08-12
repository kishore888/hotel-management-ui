import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanMasterComponent } from './plan-master.component';

describe('PlanMasterComponent', () => {
  let component: PlanMasterComponent;
  let fixture: ComponentFixture<PlanMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanMasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlanMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

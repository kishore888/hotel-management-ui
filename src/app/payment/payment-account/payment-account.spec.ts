import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentAccount } from './payment-account';

describe('PaymentAccount', () => {
  let component: PaymentAccount;
  let fixture: ComponentFixture<PaymentAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentAccount]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentAccount);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

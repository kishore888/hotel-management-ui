import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalBootstrapComponent } from './modal-bootstrap.component';

describe('ModalBootstrapComponent', () => {
  let component: ModalBootstrapComponent;
  let fixture: ComponentFixture<ModalBootstrapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalBootstrapComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalBootstrapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

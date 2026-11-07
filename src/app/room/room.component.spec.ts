/// <reference types="jasmine" />

import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KeycloakService } from 'keycloak-angular';
import { of } from 'rxjs';
import { Room } from '../model/room.model';
import { RoomComponent } from './room.component';
import { RoomService } from './room.service';

describe('RoomComponent', () => {
  let component: RoomComponent;
  let fixture: ComponentFixture<RoomComponent>;

  beforeEach(async () => {
    (window as any).$ = jasmine.createSpy().and.returnValue({
      DataTable: jasmine.createSpy().and.returnValue({
        page: jasmine.createSpy(),
        draw: jasmine.createSpy()
      })
    });

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [RoomComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: RoomService,
          useValue: {
            getRooms: jasmine.createSpy().and.returnValue(of([])),
            bookRoom: jasmine.createSpy().and.returnValue(of({}))
          }
        },
        { provide: Router, useValue: { navigate: jasmine.createSpy() } },
        { provide: NgbModal, useValue: { open: jasmine.createSpy() } },
        { provide: KeycloakService, useValue: { getUserRoles: () => [] } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select a room when opening the booking modal', () => {
    const room = new Room('room-1', 101);

    component.openBookingModal(room);

    expect(component.selectedRoom).toBe(room);
    expect(component.bookingGuestName).toBe('');
  });
});

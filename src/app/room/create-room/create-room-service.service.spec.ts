import { TestBed } from '@angular/core/testing';

import { CreateRoomServiceService } from './create-room-service.service';

describe('CreateRoomServiceService', () => {
  let service: CreateRoomServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateRoomServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

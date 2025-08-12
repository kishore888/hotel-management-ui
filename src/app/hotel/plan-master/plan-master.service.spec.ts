import { TestBed } from '@angular/core/testing';

import { PlanMasterService } from './plan-master.service';

describe('PlanMasterService', () => {
  let service: PlanMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlanMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

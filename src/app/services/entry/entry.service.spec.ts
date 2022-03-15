import { TestBed } from '@angular/core/testing';

import { EntryService } from './entry.service';

describe('EntryService', () => {
  let service: EntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { FeedlyService } from './feedly.service';

describe('FeedlyService', () => {
  let service: FeedlyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedlyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

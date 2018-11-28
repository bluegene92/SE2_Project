import { TestBed } from '@angular/core/testing';

import { BoardAccessHandlerService } from './board-access-handler.service';

describe('BoardAccessHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BoardAccessHandlerService = TestBed.get(BoardAccessHandlerService);
    expect(service).toBeTruthy();
  });
});

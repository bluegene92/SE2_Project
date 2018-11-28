import { TestBed } from '@angular/core/testing';

import { BoardConfiguratorService } from './board-configurator.service';

describe('BoardConfiguratorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BoardConfiguratorService = TestBed.get(BoardConfiguratorService);
    expect(service).toBeTruthy();
  });
});

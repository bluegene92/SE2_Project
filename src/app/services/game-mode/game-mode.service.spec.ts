import { TestBed } from '@angular/core/testing';

import { GameModeService } from './game-mode.service';

describe('GameModeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GameModeService = TestBed.get(GameModeService);
    expect(service).toBeTruthy();
  });
});

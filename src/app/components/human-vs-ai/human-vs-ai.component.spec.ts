import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HumanVsAiComponent } from './human-vs-ai.component';

describe('HumanVsAiComponent', () => {
  let component: HumanVsAiComponent;
  let fixture: ComponentFixture<HumanVsAiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HumanVsAiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HumanVsAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

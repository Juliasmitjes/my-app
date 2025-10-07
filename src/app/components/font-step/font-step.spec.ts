import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FontStep } from './font-step';

describe('FontStep', () => {
  let component: FontStep;
  let fixture: ComponentFixture<FontStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FontStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FontStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

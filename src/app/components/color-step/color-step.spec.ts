import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorStep } from './color-step';

describe('ColorStep', () => {
  let component: ColorStep;
  let fixture: ComponentFixture<ColorStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

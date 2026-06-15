import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutStep } from './layout-step';

describe('LayoutStep', () => {
  let component: LayoutStep;
  let fixture: ComponentFixture<LayoutStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

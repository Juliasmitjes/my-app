import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewStep } from './preview-step';

describe('PreviewStep', () => {
  let component: PreviewStep;
  let fixture: ComponentFixture<PreviewStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreviewStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreviewStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

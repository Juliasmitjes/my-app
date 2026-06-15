import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentStep } from './content-step';

describe('ContentStep', () => {
  let component: ContentStep;
  let fixture: ComponentFixture<ContentStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

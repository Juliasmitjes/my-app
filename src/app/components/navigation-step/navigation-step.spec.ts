import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationStep } from './navigation-step';

describe('NavigationStep', () => {
  let component: NavigationStep;
  let fixture: ComponentFixture<NavigationStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationStep]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationStep);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

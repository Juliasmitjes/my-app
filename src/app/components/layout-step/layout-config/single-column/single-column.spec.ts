import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleColumn } from './single-column';

describe('SingleColumn', () => {
  let component: SingleColumn;
  let fixture: ComponentFixture<SingleColumn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleColumn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleColumn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

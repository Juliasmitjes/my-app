import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoColumns } from './two-columns';

describe('TwoColumns', () => {
  let component: TwoColumns;
  let fixture: ComponentFixture<TwoColumns>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TwoColumns]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TwoColumns);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

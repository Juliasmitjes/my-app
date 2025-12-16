import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadUnit } from './upload-unit';

describe('UploadUnit', () => {
  let component: UploadUnit;
  let fixture: ComponentFixture<UploadUnit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadUnit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadUnit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

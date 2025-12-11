import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentUploader } from './content-uploader';

describe('ContentUploader', () => {
  let component: ContentUploader;
  let fixture: ComponentFixture<ContentUploader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentUploader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentUploader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

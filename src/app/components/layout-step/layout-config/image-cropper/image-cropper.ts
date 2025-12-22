import { Component, EventEmitter, Input, Output, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-image-cropper',
  standalone: true,
  templateUrl: './image-cropper.html',
  styleUrls: ['./image-cropper.css']
})
export class ImageCropper implements AfterViewInit {

  @Input() file!: File;
  @Output() cancel = new EventEmitter<void>();
  @Output() cropped = new EventEmitter<Blob>();

  @ViewChild('imageElement') imageElement!: ElementRef<HTMLImageElement>;
  cropper!: Cropper;

ngAfterViewInit() {
  const img = this.imageElement.nativeElement;
  img.src = URL.createObjectURL(this.file);

  setTimeout(() => {
    this.cropper = new Cropper(img, {
  aspectRatio: 1,
  viewMode: 1,
  dragMode: 'crop',
  autoCropArea: 0.6,
  background: false,
  responsive: true,
  zoomable: true,
  movable: false,
  cropBoxResizable: false,
  cropBoxMovable: true,
  guides: true,
  center: true,
  highlight: true
});

  }, 0);
}

  saveCrop() {
    this.cropper.getCroppedCanvas().toBlob((blob: Blob | null) => {
      if (blob) this.cropped.emit(blob);
    });
  }
}
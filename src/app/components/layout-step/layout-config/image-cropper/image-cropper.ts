import { Component, EventEmitter, Input, Output, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Cropper from 'cropperjs';

@Component({
  selector: 'app-image-cropper',
  standalone: true,
  templateUrl: './image-cropper.html',
  styleUrls: ['./image-cropper.css']
})
export class ImageCropper implements AfterViewInit {

  @Input() file!: File;                 // originele foto
  @Input() aspectRatio: number = 1;     // bijv. 1 voor square, 16/9 voor landscape
  @Output() cancel = new EventEmitter<void>();
  @Output() cropped = new EventEmitter<Blob>();

  @ViewChild('imageElement') imageElement!: ElementRef<HTMLImageElement>;

  cropper!: Cropper;

  ngAfterViewInit() {
  const img = this.imageElement.nativeElement;
  img.src = URL.createObjectURL(this.file);

  this.cropper = new Cropper(img, {
  aspectRatio: this.aspectRatio || 1,
  viewMode: 2,
  dragMode: 'move',
  autoCropArea: 1,
  background: false,
  responsive: true,
  zoomable: true,
  movable: true,
  scalable: false,
  rotatable: false,

  // ⭐ voeg deze toe:
  guides: true,
  center: true,
  highlight: true,
  cropBoxMovable: true,
  cropBoxResizable: false, // vierkant blijft vierkant
});
}

  saveCrop() {
    this.cropper.getCroppedCanvas().toBlob(blob => {
      if (blob) this.cropped.emit(blob);
    });
  }
}
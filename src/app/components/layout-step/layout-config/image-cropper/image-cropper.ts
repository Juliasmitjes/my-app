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

    img.onload = () => {
      this.cropper = new Cropper(img, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'crop',
        autoCropArea: 0.8,
        background: false,
        responsive: true,
        zoomable: false,
        zoomOnTouch: false,
        zoomOnWheel: false,
        movable: false,
        cropBoxResizable: true,
        cropBoxMovable: true,
        guides: true,
        center: true,
        highlight: true,
        toggleDragModeOnDblclick: false,
        ready: () => {
          const container = this.cropper.getContainerData();
          const size = Math.min(container.width, container.height) * 0.8;

          this.cropper.setCropBoxData({
            width: size,
            height: size,
            left: (container.width - size) / 2,
            top: (container.height - size) / 2
          });
        }
      });
    };

    img.src = URL.createObjectURL(this.file);
  }

  saveCrop() {
    this.cropper.getCroppedCanvas().toBlob((blob: Blob | null) => {
      if (blob) this.cropped.emit(blob);
    });
  }
}

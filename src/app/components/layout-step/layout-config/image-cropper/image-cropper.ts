import { Component, EventEmitter, Input, Output, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

@Component({
  selector: 'app-image-cropper',
  standalone: true,
  templateUrl: './image-cropper.html',
  styleUrls: ['./image-cropper.css']
})
export class ImageCropper implements AfterViewInit {

  @Input() file!: File;
  @Input() aspectRatio: number | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() cropped = new EventEmitter<Blob>();

  @ViewChild('imageElement') imageElement!: ElementRef<HTMLImageElement>;
  cropper!: Cropper;
  private objectUrl: string | null = null;

  ngAfterViewInit() {
    const img = this.imageElement.nativeElement;

    img.onload = () => {
      const ratio = this.aspectRatio && this.aspectRatio > 0 ? this.aspectRatio : 1;
      this.cropper = new Cropper(img, {
        aspectRatio: ratio,
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
          const maxWidth = container.width * 0.8;
          const maxHeight = container.height * 0.8;
          let width = maxWidth;
          let height = width / ratio;

          if (height > maxHeight) {
            height = maxHeight;
            width = height * ratio;
          }

          this.cropper.setCropBoxData({
            width,
            height,
            left: (container.width - width) / 2,
            top: (container.height - height) / 2
          });
        }
      });
    };

    this.objectUrl = URL.createObjectURL(this.file);
    img.src = this.objectUrl;
  }

  saveCrop(event?: Event) {
    event?.stopPropagation();
    if (!this.cropper) return;
    const canvas = this.cropper.getCroppedCanvas();
    if (!canvas) return;

    canvas.toBlob((blob: Blob | null) => {
      if (blob) {
        this.cleanup();
        this.cropped.emit(blob);
      }
    });
  }

  onCancel(event?: Event): void {
    event?.stopPropagation();
    this.cleanup();
    this.closed.emit();
  }

  private cleanup(): void {
    if (this.cropper) {
      this.cropper.destroy();
    }
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }
}

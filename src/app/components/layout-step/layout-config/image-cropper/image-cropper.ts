import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';

export interface PositionedImage {
  blob: Blob;
  position: {
    x: number;
    y: number;
  };
}

@Component({
  selector: 'app-image-cropper',
  standalone: true,
  templateUrl: './image-cropper.html',
  styleUrls: ['./image-cropper.css']
})
export class ImageCropper implements AfterViewInit, OnDestroy {
  @Input() file!: File;
  @Input() aspectRatio: number | null = null;
  @Output() closed = new EventEmitter<void>();
  @Output() cropped = new EventEmitter<PositionedImage>();

  @ViewChild('frame') frame!: ElementRef<HTMLDivElement>;
  @ViewChild('imageElement') imageElement!: ElementRef<HTMLImageElement>;

  imageUrl = '';
  offsetX = 0;
  offsetY = 0;
  imageWidth = 0;
  imageHeight = 0;
  frameWidth = 0;
  frameHeight = 0;
  private activePointerId: number | null = null;
  private dragStartX = 0;
  private dragStartY = 0;
  private startOffsetX = 0;
  private startOffsetY = 0;

  get frameRatio(): number {
    return this.aspectRatio && this.aspectRatio > 0 ? this.aspectRatio : 1;
  }

  get imageTransform(): string {
    return `translate3d(${this.offsetX}px, ${this.offsetY}px, 0)`;
  }

  ngAfterViewInit(): void {
    this.imageUrl = URL.createObjectURL(this.file);
  }

  onImageLoad(): void {
    const frame = this.frame.nativeElement;
    const image = this.imageElement.nativeElement;
    this.frameWidth = frame.clientWidth;
    this.frameHeight = frame.clientHeight;

    const scale = Math.max(
      this.frameWidth / image.naturalWidth,
      this.frameHeight / image.naturalHeight
    );
    this.imageWidth = image.naturalWidth * scale;
    this.imageHeight = image.naturalHeight * scale;
    this.offsetX = (this.frameWidth - this.imageWidth) / 2;
    this.offsetY = (this.frameHeight - this.imageHeight) / 2;
  }

  onDragStart(event: PointerEvent): void {
    event.preventDefault();
    this.activePointerId = event.pointerId;
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    this.startOffsetX = this.offsetX;
    this.startOffsetY = this.offsetY;
    this.frame.nativeElement.setPointerCapture(event.pointerId);
  }

  onDragMove(event: PointerEvent): void {
    if (event.pointerId !== this.activePointerId) return;
    this.offsetX = this.clampOffset(
      this.startOffsetX + event.clientX - this.dragStartX,
      this.frameWidth,
      this.imageWidth
    );
    this.offsetY = this.clampOffset(
      this.startOffsetY + event.clientY - this.dragStartY,
      this.frameHeight,
      this.imageHeight
    );
  }

  onDragEnd(event: PointerEvent): void {
    if (event.pointerId !== this.activePointerId) return;
    this.activePointerId = null;
    if (this.frame.nativeElement.hasPointerCapture(event.pointerId)) {
      this.frame.nativeElement.releasePointerCapture(event.pointerId);
    }
  }

  saveCrop(event: Event): void {
    event.stopPropagation();
    const image = this.imageElement.nativeElement;
    if (!image.naturalWidth || !this.frameWidth || !this.frameHeight) return;

    const scale = image.naturalWidth / this.imageWidth;
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(this.frameWidth * scale);
    canvas.height = Math.round(this.frameHeight * scale);
    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(
      image,
      -this.offsetX * scale,
      -this.offsetY * scale,
      canvas.width,
      canvas.height,
      0,
      0,
      canvas.width,
      canvas.height
    );
    canvas.toBlob(blob => {
      if (!blob) return;
      this.cropped.emit({
        blob,
        position: {
          x: this.toPercentage(this.offsetX, this.frameWidth, this.imageWidth),
          y: this.toPercentage(this.offsetY, this.frameHeight, this.imageHeight)
        }
      });
    }, 'image/jpeg', 0.92);
  }

  onCancel(event: Event): void {
    event.stopPropagation();
    this.closed.emit();
  }

  ngOnDestroy(): void {
    if (this.imageUrl) URL.revokeObjectURL(this.imageUrl);
  }

  private clampOffset(value: number, frameSize: number, imageSize: number): number {
    return Math.min(0, Math.max(frameSize - imageSize, value));
  }

  private toPercentage(offset: number, frameSize: number, imageSize: number): number {
    const availableDistance = imageSize - frameSize;
    return availableDistance > 0 ? Math.round((-offset / availableDistance) * 100) : 50;
  }
}

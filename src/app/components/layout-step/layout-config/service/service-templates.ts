import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { UploadUnit } from '../upload-unit/upload-unit';

type CellType = 'text' | 'image' | 'video';

@Component({
  selector: 'app-service-templates',
  standalone: true,
  templateUrl: './service-templates.html',
  imports: [CommonModule, FormsModule, LucideAngularModule, UploadUnit]
})
export class ServiceTemplates {
  @Input() template: any;
  @Input() ctx: any;

  readonly hospitalityCells: CellType[] = ['image', 'image', 'image', 'image', 'text'];
  readonly hospitalityAreas = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
  readonly hospitalityGridAreas = '"a a b b" "c d b b" "e e e e"';

  getHospitalityArea(index: number): string {
    return this.hospitalityAreas[index] ?? '';
  }

  getHospitalityValue(index: number): CellType {
    return this.hospitalityCells[index] ?? 'image';
  }

  getHospitalityLabel(index: number): string {
    return this.getHospitalityValue(index) === 'text' ? 'Tekst' : 'Foto';
  }
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { UploadUnit } from '../upload-unit/upload-unit';

type CellType = 'text' | 'image' | 'video';

@Component({
  selector: 'app-product-templates',
  standalone: true,
  templateUrl: './product-templates.html',
  imports: [CommonModule, FormsModule, LucideAngularModule, UploadUnit]
})
export class ProductTemplates {
  @Input() template: any;
  @Input() ctx: any;

  readonly showcaseCells: CellType[] = ['image', 'text', 'image', 'image'];
  readonly launchpadCells: CellType[] = ['image', 'text', 'image'];
  readonly catalogCells: CellType[] = ['image', 'image', 'image', 'text'];

  getCellValue(cells: CellType[], index: number): CellType {
    return cells[index] ?? 'image';
  }

  getCellLabel(cells: CellType[], index: number): string {
    return this.getCellValue(cells, index) === 'text' ? 'Tekst' : 'Foto';
  }
}

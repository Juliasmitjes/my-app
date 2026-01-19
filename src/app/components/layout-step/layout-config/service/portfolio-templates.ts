import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { UploadUnit } from '../upload-unit/upload-unit';

type CellType = 'text' | 'image' | 'video';

@Component({
  selector: 'app-portfolio-templates',
  standalone: true,
  templateUrl: './portfolio-templates.html',
  imports: [CommonModule, FormsModule, LucideAngularModule, UploadUnit]
})
export class PortfolioTemplates {
  @Input() template: any;
  @Input() ctx: any;

  readonly artistCells: CellType[] = ['image', 'image', 'image', 'image', 'text', 'text'];
  readonly designerCells: CellType[] = ['text', 'image', 'image'];
  readonly illustratorCells: CellType[] = ['image', 'image', 'image', 'image', 'text'];

  readonly artistAreas = ['a', 'b', 'c', 'd', 'e', 'f'];
  readonly designerAreas = ['a', 'b', 'c'];
  readonly illustratorAreas = ['a', 'b', 'c', 'd', 'e'];

  readonly artistGridAreas = '"a a b b" "a a c d" "e e f f"';
  readonly designerGridAreas = '"a b" "a c"';
  readonly illustratorGridAreas = '"a b" "c d" "e e"';

  getCellArea(areas: string[], index: number): string {
    return areas[index] ?? '';
  }

  getCellValue(cells: CellType[], index: number): CellType {
    return cells[index] ?? 'image';
  }

  getCellLabel(cells: CellType[], index: number): string {
    return this.getCellValue(cells, index) === 'text' ? 'Tekst' : 'Foto';
  }
}

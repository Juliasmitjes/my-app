import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BuilderState } from '../../../../types/builder-state';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { UploadUnit } from '../upload-unit/upload-unit';

export type CellType = 'text' | 'image' | 'video';

type TemplateGroup = 'portfolio' | 'product' | 'service' | 'editorial' | 'local' | null;

interface GridCell {
  value: CellType;
  labelMap: Record<CellType, string>;
}

interface TemplateOption {
  id: string;
  label: string;
  description: string;
  cols: number;
  rows: number;
  cells: CellType[];
}

const TEMPLATE_SETS: Record<string, TemplateOption[]> = {
  portfolio: [
    {
      id: 'portfolio-artist',
      label: 'Artist',
      description: 'Editorial beeldgrid met artistieke uitstraling.',
      cols: 3,
      rows: 4,
      cells: ['image', 'image', 'image', 'image', 'image', 'image', 'image', 'image', 'image']
    },
    {
      id: 'portfolio-case',
      label: 'Case + intro',
      description: 'Introtekst naast projectbeelden.',
      cols: 2,
      rows: 2,
      cells: ['text', 'image', 'image', 'image']
    },
    {
      id: 'portfolio-editorial',
      label: 'Editorial mix',
      description: 'Afwisseling van tekst en beeld.',
      cols: 2,
      rows: 2,
      cells: ['image', 'text', 'image', 'text']
    }
  ],
  product: [
    {
      id: 'product-focus',
      label: 'Product focus',
      description: 'Productbeeld met uitleg.',
      cols: 2,
      rows: 2,
      cells: ['image', 'image', 'text', 'text']
    },
    {
      id: 'product-deal',
      label: 'Deal highlight',
      description: 'Aanbieding met beeld en tekst.',
      cols: 2,
      rows: 2,
      cells: ['text', 'image', 'text', 'image']
    },
    {
      id: 'product-tiles',
      label: 'Product tiles',
      description: 'Afbeeldingen met korte info.',
      cols: 2,
      rows: 2,
      cells: ['image', 'text', 'image', 'text']
    }
  ]
};

@Component({
  selector: 'app-grid',
  standalone: true,
  templateUrl: './grid.html',
  imports: [
    CommonModule,
    LucideAngularModule,
    UploadUnit
  ]
})
export class Grid implements OnChanges {
  @Input() locked = false;
  @Input() uploads: Record<string, any> = {};
  @Input() layoutConfig?: BuilderState['layoutConfig'];
  @Input() contentSaved = false;
  @Input() templateGroup: TemplateGroup = null;

  @Output() configChange = new EventEmitter<any>();

  rows = 2;
  cols = 2;

  grid: GridCell[] = [];
  isSaved: Record<number, boolean> = {};

  templates: TemplateOption[] = TEMPLATE_SETS['portfolio'];
  currentTemplate: TemplateOption = TEMPLATE_SETS['portfolio'][0];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['templateGroup']) {
      this.syncTemplateSet();
    }

    if (changes['layoutConfig'] || changes['contentSaved']) {
      this.syncFromInputs();
    }
  }

  get groupTitle(): string {
    return this.templateGroup === 'product' ? 'Product templates' : 'Portfolio templates';
  }

  isArtistTemplate(template?: TemplateOption | null): boolean {
    const target = template ?? this.currentTemplate;
    return target?.id === 'portfolio-artist';
  }

  readonly artistPreviewCells: CellType[] = [
    'image',
    'image',
    'image',
    'image',
    'image',
    'image',
    'image',
    'image',
    'image'
  ];

  get artistGridAreas(): string {
    return '"a a b" "c d d" "e e f" "g h i"';
  }

  getArtistArea(index: number): string {
    const areas = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
    return areas[index] ?? '';
  }

  getArtistPreviewCell(index: number): CellType {
    return this.artistPreviewCells[index] ?? 'image';
  }

  getArtistValue(index: number): CellType {
    return this.grid[index]?.value ?? 'image';
  }

  getArtistLabel(index: number): string {
    const cell = this.grid[index];
    return cell?.labelMap[cell.value] ?? 'Foto';
  }

  getArtistCellClass(index: number): string {
    switch (index) {
      case 0:
        return 'row-span-2';
      case 1:
        return 'row-span-1';
      case 2:
        return 'row-span-2';
      case 3:
        return 'row-span-1';
      case 4:
        return 'row-span-2';
      case 5:
        return 'row-span-1';
      case 6:
        return 'row-span-2';
      case 7:
        return 'row-span-1';
      case 8:
        return 'row-span-2';
      default:
        return '';
    }
  }

  private createDefaultCell(value: CellType): GridCell {
    return {
      value,
      labelMap: {
        text: 'Tekst',
        image: 'Foto',
        video: 'Video'
      }
    };
  }

  private syncTemplateSet() {
    const group = this.templateGroup === 'product' ? 'product' : 'portfolio';
    this.templates = TEMPLATE_SETS[group];
    this.currentTemplate = this.templates[0];
    this.applyTemplate(this.currentTemplate);
  }

  selectTemplate(template: TemplateOption) {
    if (this.locked) return;
    this.currentTemplate = template;
    this.applyTemplate(template);
  }

  private applyTemplate(template: TemplateOption) {
    this.cols = template.cols;
    this.rows = template.rows;
    this.grid = template.cells.map(value => this.createDefaultCell(value));
    this.emitConfig();
  }

  private emitConfig() {
    this.configChange.emit({
      layout: 'grid',
      config: {
        cols: this.cols,
        cells: this.grid.map(c => c.value),
        templateGroup: this.templateGroup
      }
    });
  }

  private syncFromInputs() {
    const cols = this.layoutConfig?.cols;
    const cells = this.layoutConfig?.cells;

    if (cols && cells && cells.length) {
      this.cols = cols;
      this.rows = Math.max(1, Math.ceil(cells.length / cols));
      this.grid = cells.map(value => this.createDefaultCell(value));
    } else if (!this.grid.length) {
      this.applyTemplate(this.currentTemplate);
    }

    if (this.contentSaved) {
      this.grid.forEach((_, index) => {
        this.isSaved[index] = true;
      });
    } else {
      this.isSaved = {};
    }
  }

  getUploadKey(index: number): string {
    const cell = this.grid[index];
    return `grid_${index}_${cell.value}`;
  }

  isUploadComplete(index: number): boolean {
    return !!this.uploads[this.getUploadKey(index)];
  }

  onRequestUpload(index: number, uploadKey: string, type: CellType) {
    this.isSaved[index] = false;

    this.configChange.emit({
      layout: 'grid',
      config: {
        cellIndex: index,
        uploadType: type,
        uploadKey,
        templateGroup: this.templateGroup
      },
      contentSaved: false
    });
  }

  onRequestClear(index: number, uploadKey: string) {
    this.clearUploads(index);
  }

  onSaveClick(index: number, event: Event) {
    event.stopPropagation();

    if (!this.isUploadComplete(index)) return;

    if (this.isSaved[index]) {
      this.isSaved[index] = false;
      this.configChange.emit({
        layout: 'grid',
        contentSaved: false
      });
      return;
    }

    this.isSaved[index] = true;
    const allSaved = this.grid.every((_, i) => this.isSaved[i]);
    this.configChange.emit({
      layout: 'grid',
      contentSaved: allSaved
    });
  }

  clearUploads(index: number) {
    const key = this.getUploadKey(index);

    this.configChange.emit({
      layout: 'grid',
      config: {
        clearUploadKeys: [key]
      },
      contentSaved: false
    });

    this.emitConfig();
  }
}

import { Component, EventEmitter, Output, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { BuilderState } from '../../../../types/builder-state';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { UploadUnit } from '../upload-unit/upload-unit';

export type CellType = 'text' | 'image' | 'video';

type TemplateGroup = 'service' | 'portfolio' | 'product' | 'local' | null;

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
  service: [
    {
      id: 'service-restaurant',
      label: 'Hospitality',
      description: 'Sfeervol beeldgrid met ruimte voor tekst.',
      cols: 4,
      rows: 3,
      cells: ['image', 'image', 'image', 'image', 'text']
    },
    {
      id: 'service-beauty',
      label: 'Wellness',
      description: 'Intro tekst met beeld.',
      cols: 2,
      rows: 1,
      cells: ['text', 'image']
    },
    {
      id: 'service-industrial',
      label: 'Industry',
      description: 'Hero met beeld en tekst.',
      cols: 1,
      rows: 2,
      cells: ['image', 'text']
    }
  ]
};

@Component({
  selector: 'app-service',
  standalone: true,
  templateUrl: './service.html',
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    UploadUnit
  ]
})
export class Service implements OnChanges, OnDestroy {
  @Input() locked = false;
  @Input() uploads: Record<string, any> = {};
  @Input() layoutConfig?: BuilderState['layoutConfig'];
  @Input() contentSaved = false;
  @Input() templateGroup: TemplateGroup = 'service';

  @Output() configChange = new EventEmitter<any>();

  rows = 2;
  cols = 2;

  grid: GridCell[] = [];
  isSaved: Record<number, boolean> = {};

  templates: TemplateOption[] = TEMPLATE_SETS['service'];
  currentTemplate: TemplateOption = TEMPLATE_SETS['service'][0];
  businessNameInput = '';
  isEditingBusinessName = false;
  subtitleInput = '';
  isEditingSubtitle = false;
  suppressAutoEdit = false;
  private blobUrlCache = new Map<string, string>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['templateGroup']) {
      this.syncTemplateSet();
    }

    if (changes['uploads']) {
      this.resetBlobUrls();
    }

    if (changes['layoutConfig'] || changes['contentSaved'] || changes['uploads'] || changes['locked']) {
      this.syncFromInputs();
    }
  }

  ngOnDestroy(): void {
    this.resetBlobUrls();
  }

  get groupTitle(): string {
    return 'Service templates';
  }

  get subtitleDisplay(): string {
    return this.subtitleInput.trim() || 'Hier komt jouw ondertitel.';
  }

  isRestaurantTemplate(template?: TemplateOption | null): boolean {
    const target = template ?? this.currentTemplate;
    return target?.id === 'service-restaurant';
  }

  readonly restaurantPreviewCells: CellType[] = [
    'image',
    'image',
    'image',
    'image',
    'text'
  ];

  get restaurantGridAreas(): string {
    return '"a a b b" "c d b b" "e e e e"';
  }

  getRestaurantArea(index: number): string {
    const areas = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
    return areas[index] ?? '';
  }

  getRestaurantValue(index: number): CellType {
    return this.restaurantPreviewCells[index] ?? 'image';
  }

  getRestaurantLabel(index: number): string {
    return this.getRestaurantValue(index) === 'text' ? 'Tekst' : 'Foto';
  }

  isBeautyTemplate(template?: TemplateOption | null): boolean {
    const target = template ?? this.currentTemplate;
    return target?.id === 'service-beauty';
  }

  isIndustrialTemplate(template?: TemplateOption | null): boolean {
    const target = template ?? this.currentTemplate;
    return target?.id === 'service-industrial';
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
    this.templates = TEMPLATE_SETS['service'];
    const savedTemplateId = this.layoutConfig?.templateId;
    const found = savedTemplateId ? this.templates.find(t => t.id === savedTemplateId) : null;
    this.currentTemplate = found ?? this.templates[0];
    this.applyTemplate(this.currentTemplate);
    this.syncBusinessNameInput(this.currentTemplate.id);
    this.syncSubtitleInput(this.currentTemplate.id);
  }

  selectTemplate(template: TemplateOption) {
    if (this.locked) return;
    this.currentTemplate = template;
    this.applyTemplate(template);
    this.syncBusinessNameInput(template.id);
    this.syncSubtitleInput(template.id);
  }

  onTemplateAction(template: TemplateOption, event?: Event) {
    event?.stopPropagation();

    if (this.locked) {
      if (template.id !== this.currentTemplate.id) {
        this.currentTemplate = template;
        this.applyTemplate(template);
        this.syncBusinessNameInput(template.id);
        this.syncSubtitleInput(template.id);
        this.configChange.emit({
          layout: 'grid',
          contentSaved: false
        });
        this.suppressAutoEdit = false;
        this.emitConfig();
        return;
      }
      this.isEditingBusinessName = false;
      this.isEditingSubtitle = false;
      if (this.contentSaved) {
        this.configChange.emit({
          layout: 'grid',
          contentSaved: false
        });
        this.isEditingBusinessName = true;
        this.isEditingSubtitle = true;
        this.suppressAutoEdit = false;
        return;
      }
      this.configChange.emit({
        layout: 'grid',
        config: {
          businessName: this.businessNameInput.trim(),
          subtitle: this.subtitleInput.trim(),
          businessNameTemplateId: this.currentTemplate.id,
          templateGroup: this.templateGroup
        }
      });
      this.configChange.emit({
        layout: 'grid',
        contentSaved: true
      });
      return;
    }

    this.selectTemplate(template);
    this.configChange.emit({
      layout: 'grid',
      action: 'lock'
    });
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
        templateGroup: this.templateGroup,
        templateId: this.currentTemplate?.id
      }
    });
  }

  private syncFromInputs() {
    const savedTemplateId = this.layoutConfig?.templateId;
    if (savedTemplateId) {
      const match = this.templates.find(t => t.id === savedTemplateId);
      if (match) {
        this.currentTemplate = match;
      }
    }
    const cols = this.layoutConfig?.cols;
    const cells = this.layoutConfig?.cells;
    const businessName = this.currentTemplate ? this.getSavedBusinessName(this.currentTemplate.id) : '';
    const subtitle = this.currentTemplate ? this.getSavedSubtitle(this.currentTemplate.id) : '';

    if (cols && cells && cells.length) {
      this.cols = cols;
      this.rows = Math.max(1, Math.ceil(cells.length / cols));
      this.grid = cells.map(value => this.createDefaultCell(value));
    } else if (!this.grid.length) {
      this.applyTemplate(this.currentTemplate);
    }

    if (typeof businessName === 'string') {
      if (!this.isEditingBusinessName) {
        this.businessNameInput = businessName;
      }
    }
    if (typeof subtitle === 'string') {
      this.subtitleInput = subtitle;
    }

    if (this.locked) {
      const canEdit = !this.contentSaved && !this.suppressAutoEdit;
      if (!this.isEditingBusinessName) {
        this.isEditingBusinessName = !this.businessNameInput.trim() && canEdit;
      }
      if (!this.isEditingSubtitle) {
        this.isEditingSubtitle = !this.subtitleInput.trim() && canEdit;
      }
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
    const value = cell?.value ?? 'image';
    const templateId = this.currentTemplate?.id ?? 'default';
    return `grid_${templateId}_${index}_${value}`;
  }

  isUploadComplete(index: number): boolean {
    return !!this.uploads[this.getUploadKey(index)];
  }

  onRequestUpload(index: number, uploadKey: string, type: CellType, cellEl?: HTMLElement | null) {
    this.isSaved[index] = false;

    const aspectRatio = type === 'image' ? this.getCellAspectRatio(cellEl) : null;

    this.configChange.emit({
      layout: 'grid',
      config: {
        cellIndex: index,
        uploadType: type,
        uploadKey,
        templateGroup: this.templateGroup,
        aspectRatio
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
      if (!this.isIndustrialTemplate()) {
        this.configChange.emit({
          layout: 'grid',
          contentSaved: false
        });
      }
      return;
    }

    this.isSaved[index] = true;
    if (!this.isIndustrialTemplate()) {
      const allSaved = this.grid.every((_, i) => this.isSaved[i]);
      this.configChange.emit({
        layout: 'grid',
        contentSaved: allSaved
      });
    }
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

  saveBusinessName(): void {
    const value = this.businessNameInput.trim();
    this.configChange.emit({
      layout: 'grid',
      config: {
        businessName: value,
        businessNameTemplateId: this.currentTemplate.id,
        templateGroup: this.templateGroup
      }
    });
    this.isEditingBusinessName = false;
    this.suppressAutoEdit = true;
  }

  editBusinessName(): void {
    this.isEditingBusinessName = true;
  }

  saveSubtitle(): void {
    const value = this.subtitleInput.trim();
    const businessValue = this.businessNameInput.trim();
    this.configChange.emit({
      layout: 'grid',
      config: {
        businessName: businessValue,
        subtitle: value,
        businessNameTemplateId: this.currentTemplate.id,
        templateGroup: this.templateGroup
      }
    });
    this.isEditingSubtitle = false;
    this.isEditingBusinessName = false;
    this.suppressAutoEdit = true;
  }

  editSubtitle(): void {
    this.isEditingSubtitle = true;
    this.isEditingBusinessName = true;
  }

  private getCellAspectRatio(cellEl?: HTMLElement | null): number | null {
    if (!cellEl) return null;
    const rect = cellEl.getBoundingClientRect();
    if (!rect.height) return null;
    const ratio = rect.width / rect.height;
    if (!Number.isFinite(ratio) || ratio <= 0) return null;
    return ratio;
  }

  getImagePreview(index: number): string | null {
    const cell = this.grid[index];
    if (!cell || cell.value !== 'image') {
      return null;
    }

    const key = this.getUploadKey(index);
    const file = this.uploads?.[key];

    if (!file || file?.kind === 'inline') {
      return null;
    }

    if (file instanceof File) {
      const cached = this.blobUrlCache.get(key);
      if (cached) {
        return cached;
      }
      const url = URL.createObjectURL(file);
      this.blobUrlCache.set(key, url);
      return url;
    }

    if (typeof file === 'string') {
      return file;
    }

    return null;
  }

  getBusinessNameForTemplate(templateId?: string): string {
    const id = templateId ?? this.currentTemplate?.id;
    if (!id) {
      return 'Bedrijfsnaam';
    }

    const saved = this.getSavedBusinessName(id);
    if (saved) {
      return saved;
    }

    if (id === this.currentTemplate?.id) {
      return this.businessNameInput.trim() || 'Bedrijfsnaam';
    }

    return 'Bedrijfsnaam';
  }

  private getBusinessNameKey(templateId: string): string {
    return `business_name_${templateId}`;
  }

  private getSavedBusinessName(templateId: string): string {
    const value = this.uploads?.[this.getBusinessNameKey(templateId)];
    return typeof value === 'string' ? value : '';
  }

  private syncBusinessNameInput(templateId: string): void {
    if (this.isEditingBusinessName) return;
    this.businessNameInput = this.getSavedBusinessName(templateId);
  }

  private getSubtitleKey(templateId: string): string {
    return `service_subtitle_${templateId}`;
  }

  private getSavedSubtitle(templateId: string): string {
    const perTemplate = this.uploads?.[this.getSubtitleKey(templateId)];
    return typeof perTemplate === 'string' ? perTemplate : '';
  }

  private syncSubtitleInput(templateId: string): void {
    this.subtitleInput = this.getSavedSubtitle(templateId);
  }

  getSubtitleForTemplate(templateId?: string): string {
    const id = templateId ?? this.currentTemplate?.id;
    if (!id) {
      return 'Hier komt jouw ondertitel.';
    }
    if (id === this.currentTemplate?.id) {
      return this.subtitleInput.trim() || 'Hier komt jouw ondertitel.';
    }
    const saved = this.getSavedSubtitle(id);
    return saved || 'Hier komt jouw ondertitel.';
  }

  getTextPreview(index: number): string | null {
    const cell = this.grid[index];
    if (!cell || cell.value !== 'text') {
      return null;
    }

    const key = this.getUploadKey(index);
    const value = this.uploads?.[key];
    if (!value || value?.kind !== 'inline') {
      return null;
    }

    const content = value.value;
    if (content && typeof content === 'object') {
      return content.body ?? content.subtitle ?? content.title ?? null;
    }

    if (typeof content === 'string') {
      return content;
    }

    return null;
  }

  getTextContent(index: number): { title?: string; subtitle?: string; body?: string } | null {
    const cell = this.grid[index];
    if (!cell || cell.value !== 'text') {
      return null;
    }

    const key = this.getUploadKey(index);
    const entry = this.uploads?.[key];
    if (!entry) {
      return null;
    }

    if (entry?.kind === 'inline') {
      const content = entry.value;
      if (content && typeof content === 'object') {
        return {
          title: content.title ?? '',
          subtitle: content.subtitle ?? '',
          body: content.body ?? ''
        };
      }

      if (typeof content === 'string') {
        return { body: content };
      }
    }

    if (entry && typeof entry === 'object') {
      const content = entry as { title?: string; subtitle?: string; body?: string };
      if (content.title || content.subtitle || content.body) {
        return {
          title: content.title ?? '',
          subtitle: content.subtitle ?? '',
          body: content.body ?? ''
        };
      }
    }

    if (typeof entry === 'string') {
      return { body: entry };
    }

    return null;
  }

  private resetBlobUrls(): void {
    for (const url of this.blobUrlCache.values()) {
      URL.revokeObjectURL(url);
    }
    this.blobUrlCache.clear();
  }
}

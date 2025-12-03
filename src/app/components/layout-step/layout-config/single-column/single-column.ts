import { Component, EventEmitter, Output } from '@angular/core';

interface ColumnOption {
  id: string;
  label: string;
  preview: string;
}

@Component({
  selector: 'app-single-column',
  templateUrl: './single-column.html',
})


export class SingleColumn {
  @Output() change = new EventEmitter<string>();

  selectedOption: string | null = null;

  columnOptions: ColumnOption[] = [
    { id: 'text', label: 'Tekst', preview: '/assets/previews/text.png' },
    { id: 'image', label: 'Afbeelding', preview: '/assets/previews/image.png' },
    { id: 'text-image', label: 'Tekst → Afbeelding', preview: '/assets/previews/text-image.png' },
    { id: 'image-text', label: 'Afbeelding → Tekst', preview: '/assets/previews/image-text.png' },
    { id: 'image-image-text', label: '2 Afbeeldingen → Tekst', preview: '/assets/previews/image-image-text.png' },
  ];

  select(optionId: string) {
    this.selectedOption = optionId;
    this.change.emit(optionId);
  }
}

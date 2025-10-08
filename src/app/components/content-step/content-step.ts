import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderState } from '../../types/builder-state';
import { CardComponent } from '../ui/card/card';
import { CardHeader } from '../ui/card/card-header';
import { CardTitle } from '../ui/card/card-title';
import { CardContent } from '../ui/card/card-content'; 


@Component({
  selector: 'app-content-step',
  standalone: true,
  imports: [CommonModule, CardComponent, CardHeader, CardTitle, CardContent],
  templateUrl: './content-step.html',
  styleUrl: './content-step.css'
})


export class ContentStep {
  @Input() builderState!: BuilderState;
  @Input() contents: any[] = [];
  @Output() update = new EventEmitter<Partial<BuilderState>>();

  @Output() toggle = new EventEmitter<string>();

  onSelectPage(page: string) {
    this.toggle.emit(page);
}

}

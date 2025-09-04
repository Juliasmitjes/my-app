import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClothingService } from '../services/clothing.service';
import { ClothingData } from '../clothing-data';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [RouterModule, CurrencyPipe],
  providers: [ClothingService], 
template: `
  
<section> 
  <h2 class="text-2xl font-bold mb-4">Overzicht van Kledingstukken</h2>
  @for (item of clothingData; track item.id) {
    <div>
      <h2>
      {{item.name}} - {{item.type}} - {{item.color}} - {{item.size}} - {{item.price | currency:'EUR'}}
    </h2>
    <a [routerLink]="[/'details', clothingData.id]"></a>
    </div>
  }
  <button type="button" routerLink="/">Ga terug naar Home</button>
</section>
   
  `,
  styleUrl: './overview.css'
})

export class Overview {
  clothingData: ClothingData[] = [];

  constructor(private clothingService: ClothingService) {
    this.clothingData = this.clothingService.getClothing();
  }
}

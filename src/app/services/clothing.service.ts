import { Injectable } from '@angular/core';
import { ClothingData } from '../clothing-data';

@Injectable({ providedIn: 'root' })
export class ClothingService {
  getClothing(): ClothingData[] {
    return [
      { id: 1, name: 'Jas', type: 'Winter', color: 'Blauw', size: 'M', price: 89.99 },
      { id: 2, name: 'T-shirt', type: 'Zomer', color: 'Wit', size: 'L', price: 19.99 },
    ];
  }
}

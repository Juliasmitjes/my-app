import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [RouterModule],
  template: `
    <p className="text-red-500 font-bold">
      overview works!
    </p>

    <button type="button" routerLink="/">Ga terug naar Home</button>
  `,
  styleUrl: './overview.css'
})
export class Overview {

}

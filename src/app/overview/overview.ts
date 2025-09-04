import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [RouterModule],
  template: `
    <p>
      overview works!
    </p>
  `,
  styleUrl: './overview.css'
})
export class Overview {

}

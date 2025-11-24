import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatBigTableComponent } from './mat-big-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatBigTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular17-app';
}

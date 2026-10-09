import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-daily-summary-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './daily-summary-card.html',
  styleUrl: './daily-summary-card.css'
})
export class DailySummaryCard {

  readonly title = input.required<string>();
  readonly value = input.required<number | string>();
  readonly detail = input('');
  readonly icon = input('analytics');
  readonly accent = input('blue');
}

import { DatePipe, registerLocaleData } from '@angular/common';
import localeEsPe from '@angular/common/locales/es-PE';
import { Component, computed, input, output, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Observation } from '../../domain/model/observation.entity';
import { CrisisSeverity } from '../../domain/model/crisis-severity.enum';

registerLocaleData(localeEsPe);

@Component({
  selector: 'app-episode-calendar',
  imports: [DatePipe, MatIconModule],
  templateUrl: './episode-calendar.html',
  styleUrl: './episode-calendar.css',
})
export class EpisodeCalendar {
  readonly records = input.required<Observation[]>();
  readonly episodeOpened = output<Observation>();
  readonly today = new Date();
  readonly month = signal(new Date(this.today.getFullYear(), this.today.getMonth(), 1));
  readonly selected = signal(this.dayKey(this.today));
  readonly weekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  readonly severity = {
    [CrisisSeverity.Mild]: 'Leve',
    [CrisisSeverity.Moderate]: 'Moderada',
    [CrisisSeverity.Severe]: 'Severa',
  };

  readonly byDay = computed(() => {
    const grouped = new Map<string, Observation[]>();
    for (const record of this.records()) {
      const key = this.dayKey(new Date(record.occurredAt));
      const existing = grouped.get(key);
      if (existing) existing.push(record);
      else grouped.set(key, [record]);
    }
    return grouped;
  });

  readonly days = computed(() => {
    const start = this.month();
    const year = start.getFullYear();
    const month = start.getMonth();
    const leading = (start.getDay() + 6) % 7;
    const length = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: leading + length }, (_, index) => {
      if (index < leading) return null;
      const date = new Date(year, month, index - leading + 1);
      const key = this.dayKey(date);
      return { date, key, count: this.byDay().get(key)?.length ?? 0 };
    });
  });

  readonly selectedRecords = computed(() => this.byDay().get(this.selected()) ?? []);
  readonly selectedDate = computed(() => {
    const [year, month, day] = this.selected().split('-').map(Number);
    return new Date(year, month - 1, day);
  });

  changeMonth(offset: number): void {
    const current = this.month();
    const month = new Date(current.getFullYear(), current.getMonth() + offset, 1);
    this.month.set(month);
    this.selected.set(this.dayKey(month));
  }

  goToToday(): void {
    this.month.set(new Date(this.today.getFullYear(), this.today.getMonth(), 1));
    this.selected.set(this.dayKey(this.today));
  }

  dayKey(date: Date): string {
    return [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(value =>
      String(value).padStart(2, '0')).join('-');
  }
}

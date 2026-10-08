import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-routine-activity-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './routine-activity-form.html',
  styleUrl: './routine-activity-form.css'
})
export class RoutineActivityFormComponent {
  title = '';
  order = 1;
  durationMinutes = 0;
  timerEnabled = false;

  @Output()
  submitted = new EventEmitter<{
    title: string;
    order: number;
    durationMinutes: number;
    timerEnabled: boolean;
  }>();

  submit(): void {
    if (!this.title.trim() || this.durationMinutes < 0) {
      return;
    }

    this.submitted.emit({
      title: this.title.trim(),
      order: this.order,
      durationMinutes: this.durationMinutes,
      timerEnabled: this.timerEnabled
    });
  }
}

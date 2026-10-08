import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-routine-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './routine-form.html',
  styleUrl: './routine-form.css'
})
export class RoutineFormComponent {
  name = '';
  childId: number | null = null;

  @Output()
  submitted = new EventEmitter<{
    name: string;
    childId: number;
  }>();

  submit(): void {
    if (!this.name.trim() || this.childId === null) {
      return;
    }

    this.submitted.emit({
      name: this.name.trim(),
      childId: this.childId
    });
  }
}

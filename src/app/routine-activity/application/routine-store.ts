import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Routine } from '../domain/model/routine.entity';

@Injectable({
  providedIn: 'root'
})
export class RoutineStore {

  private readonly routinesSubject =
    new BehaviorSubject<Routine[]>([]);

  readonly routines$: Observable<Routine[]> =
    this.routinesSubject.asObservable();

  setRoutines(routines: Routine[]): void {
    this.routinesSubject.next(routines);
  }

  getRoutines(): Routine[] {
    return this.routinesSubject.value;
  }

  addRoutine(routine: Routine): void {
    this.routinesSubject.next([
      ...this.routinesSubject.value,
      routine
    ]);
  }

  removeRoutine(id: number): void {
    this.routinesSubject.next(
      this.routinesSubject.value.filter(routine => routine.id !== id)
    );
  }
}

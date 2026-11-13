import { Routine } from './routine.entity';
import { RoutineActivity } from './routine-activity.entity';
import { RoutineStatus } from './routine-status';

describe('BC04 Routine', () => {
  it('validates a routine with a child and an ordered activity', () => {
    const routine = new Routine({ id: 1, childId: 'child-001', name: 'Mañana',
      activities: [new RoutineActivity({ id: 1, routineId: 1, name: 'Desayuno', activityOrder: 1, durationMinutes: 10 })] });
    expect(routine.esValida()).toBe(true);
  });
  it('duplicates activities as a draft referencing the source routine', () => {
    const routine = new Routine({ id: 8, childId: 'child-001', name: 'Tarde',
      activities: [new RoutineActivity({ id: 7, routineId: 8, name: 'Leer', activityOrder: 1, durationMinutes: 15 })] });
    const copy = routine.duplicarRutina();
    expect(copy.status).toBe(RoutineStatus.DRAFT);
    expect(copy.originalRoutineId).toBe(8);
    expect(copy.activities[0].id).toBe(0);
  });
});

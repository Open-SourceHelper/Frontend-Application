import { CrisisSeverity } from '../../domain/model/crisis-severity.enum';
import { Observation } from '../../domain/model/observation.entity';

export const exampleChild = { id: 'demo-mateo', firstName: 'Mateo', lastName: 'Ejemplo' };

export function exampleEpisodes(): Observation[] {
  const daysAgo = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
  };

  const shared = { childId: exampleChild.id, caregiverId: 'demo-caregiver' };
  return [
    new Observation({
      ...shared, id: 'example-1', occurredAt: daysAgo(1), crisisSeverity: CrisisSeverity.Mild,
      description: 'Se inquietó al cambiar de actividad. Un aviso visual le ayudó a retomar la rutina.',
      durationMinutes: 5, trigger: 'Cambio de actividad', helped: 'Aviso visual',
    }),
    new Observation({
      ...shared, id: 'example-2', occurredAt: daysAgo(4), crisisSeverity: CrisisSeverity.Moderate,
      description: 'El ruido del recreo le incomodó. Después de una pausa volvió a la actividad.',
      durationMinutes: 12, trigger: 'Ruido', helped: 'Pausa en un lugar tranquilo',
      reviewedAt: daysAgo(2), reviewedBy: 'demo-psychologist',
    }),
    new Observation({
      ...shared, id: 'example-3', occurredAt: daysAgo(8),
      description: 'Completó su rutina de la mañana con apoyo visual.',
    }),
  ];
}

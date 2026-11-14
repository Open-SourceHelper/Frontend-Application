import {
  ActivateCrisisAlertCommand,
  CrisisAlert,
  CrisisAlertStatus
} from './crisis-alert.model';

export function createCrisisAlert(
  command: ActivateCrisisAlertCommand,
  recipientIds: string[],
  id: string,
  now: string
): CrisisAlert {
  if (!command.childId.trim() || !command.caregiverId.trim()) {
    throw new Error('Se debe indicar un niño y un cuidador.');
  }
  if (command.description.length > 500) {
    throw new Error('La descripción no puede superar 500 caracteres.');
  }
  return {
    id,
    childId: command.childId.trim(),
    caregiverId: command.caregiverId.trim(),
    description: command.description.trim(),
    status: 'ACTIVE',
    notifiedCaregiverIds: [...recipientIds],
    createdAt: now,
    attendedAt: null,
    closedAt: null,
    attendedById: null,
    closedById: null
  };
}

export function transitionCrisisAlert(
  alert: CrisisAlert,
  nextStatus: Exclude<CrisisAlertStatus, 'ACTIVE'>,
  actorId: string,
  now: string
): CrisisAlert {
  if (!actorId.trim()) {
    throw new Error('El cuidador es obligatorio.');
  }
  if (nextStatus === 'ATTENDED' && alert.status === 'ACTIVE') {
    return { ...alert, status: 'ATTENDED', attendedAt: now, attendedById: actorId };
  }
  if (nextStatus === 'CLOSED' && alert.status === 'ATTENDED') {
    return { ...alert, status: 'CLOSED', closedAt: now, closedById: actorId };
  }
  throw new Error('No se permite esta transición de estado.');
}

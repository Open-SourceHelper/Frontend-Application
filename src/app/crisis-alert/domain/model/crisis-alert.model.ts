export type CrisisAlertStatus = 'ACTIVE' | 'ATTENDED' | 'CLOSED';

export interface CrisisAlert {
  id: string;
  childId: string;
  caregiverId: string;
  description: string;
  status: CrisisAlertStatus;
  notifiedCaregiverIds: string[];
  createdAt: string;
  attendedAt: string | null;
  closedAt: string | null;
  attendedById: string | null;
  closedById: string | null;
}

export interface ActivateCrisisAlertCommand {
  childId: string;
  caregiverId: string;
  description: string;
}

export interface CrisisAlertNotification {
  id: string;
  alertId: string;
  childId: string;
  recipientCaregiverId: string;
  channel: 'IN_APP';
  status: 'QUEUED';
  createdAt: string;
}

export interface AlertActivationResult {
  alert: CrisisAlert;
  queuedCount: number;
  failedCount: number;
}

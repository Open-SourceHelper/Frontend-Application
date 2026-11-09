import { createCrisisAlert, transitionCrisisAlert } from './crisis-alert.rules';
import { CrisisAlert } from './crisis-alert.model';

const command = {
  childId: 'child-001',
  caregiverId: 'caregiver-alert-001',
  description: 'Sensibilidad al ruido'
};
const now = '2026-11-08T20:00:00.000Z';

describe('BC03 crisis alert domain rules', () => {
  it('creates a new active alert with authorized recipients', () => {
    const alert = createCrisisAlert(command, ['caregiver-alert-002'], 'alert-1', now);
    expect(alert.status).toBe('ACTIVE');
    expect(alert.notifiedCaregiverIds).toEqual(['caregiver-alert-002']);
    expect(alert.createdAt).toBe(now);
  });

  it('requires the child and caregiver', () => {
    expect(() => createCrisisAlert({ ...command, caregiverId: ' ' }, [], 'a', now))
      .toThrow();
  });

  it('allows only ACTIVE -> ATTENDED -> CLOSED', () => {
    const initial: CrisisAlert = createCrisisAlert(command, [], 'alert-1', now);
    const attended = transitionCrisisAlert(initial, 'ATTENDED', 'caregiver-alert-002', now);
    expect(attended.attendedById).toBe('caregiver-alert-002');
    const closed = transitionCrisisAlert(attended, 'CLOSED', 'caregiver-alert-002', now);
    expect(closed.status).toBe('CLOSED');
    expect(() => transitionCrisisAlert(initial, 'CLOSED', 'caregiver-alert-002', now))
      .toThrow();
  });
});

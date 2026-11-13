import { PatientAssignment } from './patient-assignment.entity';
import { AssignmentStatus } from './assignment-status';

describe('BC04 PatientAssignment', () => {
  it('requires a currently active, not ended assignment', () => {
    const assignment = new PatientAssignment('a-1', 'PSI01', 'child-01', AssignmentStatus.ACTIVE,
      new Date('2026-01-01'), new Date('2026-02-01'));
    expect(assignment.verificarAsignacion()).toBe(false);
  });
  it('re-activates assignment only for valid references', () => {
    const assignment = new PatientAssignment('a-2', 'PSI01', 'child-01');
    expect(assignment.asignarPaciente()).toBe(true);
    expect(assignment.verificarAsignacion()).toBe(true);
  });
});

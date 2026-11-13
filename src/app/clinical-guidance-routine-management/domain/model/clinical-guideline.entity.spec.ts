import { ClinicalGuideline } from './clinical-guideline.entity';
import { GuidelineStatus } from './guideline-status';

describe('BC04 ClinicalGuideline', () => {
  it('requires a valid psychologist-child assignment reference and instructions', () => {
    const guideline = new ClinicalGuideline('guideline-1', 'PSI001', 'child-001', '');
    expect(guideline.validarPauta()).toBe(false);
  });
  it('activates a valid professional guideline', () => {
    const guideline = new ClinicalGuideline('guideline-2', 'PSI001', 'child-001', 'Seguir el plan individual.');
    guideline.habilitarParaCuidadores();
    expect(guideline.status).toBe(GuidelineStatus.ACTIVE);
  });
});

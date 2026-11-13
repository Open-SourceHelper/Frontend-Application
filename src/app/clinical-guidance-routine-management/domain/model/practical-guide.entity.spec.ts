import { PracticalGuide } from './practical-guide.entity';
import { GuideCategory } from './guide-category';

describe('BC04 PracticalGuide', () => {
  it('finds a matching title case-insensitively', () => {
    const guide = new PracticalGuide('g-1', 'Rutina visual', GuideCategory.ROUTINE, 'Organizar el día');
    expect(guide.buscarPorSituacion('VISUAL')).toBe(true);
    expect(guide.buscarPorSituacion('')).toBe(false);
  });
});

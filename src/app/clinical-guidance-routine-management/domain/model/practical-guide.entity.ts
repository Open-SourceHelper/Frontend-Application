import { GuideCategory } from './guide-category';
/** A curated non-patient-specific repository entry. */
export class PracticalGuide {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly category: GuideCategory,
    readonly content: string,
    readonly status: string = 'ACTIVE',
    readonly createdAt: Date = new Date(),
    readonly updatedAt: Date = new Date()
  ) {}

  buscarPorCategoria(category: GuideCategory): boolean { return this.category === category; }
  buscarPorSituacion(situation: string): boolean {
    const search = situation.trim().toLowerCase();
    return !!search && (this.title.toLowerCase().includes(search) || this.content.toLowerCase().includes(search));
  }
  consultarDetalle(): PracticalGuide { return this; }
  consultarInstrucciones(): string { return this.content; }
}

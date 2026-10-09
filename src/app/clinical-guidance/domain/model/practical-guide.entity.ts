import { GuideCategory } from './guide-category';

/**
 * Represents a practical guide for caregivers.
 */
export class PracticalGuide {
  #id: string;
  #title: string;
  #category: GuideCategory;
  #content: string;

  constructor(
    id: string,
    title: string,
    category: GuideCategory,
    content: string
  ) {
    this.#id = id;
    this.#title = title;
    this.#category = category;
    this.#content = content;
  }

  get id(): string {
    return this.#id;
  }

  get title(): string {
    return this.#title;
  }

  get category(): GuideCategory {
    return this.#category;
  }

  get content(): string {
    return this.#content;
  }

  buscarPorCategoria(category: GuideCategory): boolean {
    return this.#category === category;
  }

  buscarPorSituacion(situation: string): boolean {
    const search = situation.trim().toLowerCase();

    if (!search) {
      return false;
    }

    return (
      this.#title.toLowerCase().includes(search) ||
      this.#content.toLowerCase().includes(search)
    );
  }

  consultarDetalle(): PracticalGuide {
    return this;
  }

  consultarInstrucciones(): string {
    return this.#content;
  }
}

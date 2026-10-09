/**
 * Value Object representing a clinical guideline instruction.
 */
export class GuidelineInstruction {
  #content: string;

  constructor(content: string) {
    this.#content = content;
  }

  get content(): string {
    return this.#content;
  }

  validar(): boolean {
    return this.#content.trim().length > 0;
  }
}

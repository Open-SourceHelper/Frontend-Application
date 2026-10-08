import { GuidelineStatus } from './guideline-status';
import { GuidelineInstruction } from './guideline-instruction';

/**
 * Aggregate Root for clinical guidance management.
 */
export class ClinicalGuideline {
  #id: string;
  #psychologistId: string;
  #childId: string;
  #instructions: string;
  #status: GuidelineStatus;
  #createdAt: Date;
  #updatedAt: Date;

  constructor(
    id: string,
    psychologistId: string,
    childId: string,
    instructions: string,
    status: GuidelineStatus = GuidelineStatus.DRAFT,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.#id = id;
    this.#psychologistId = psychologistId;
    this.#childId = childId;
    this.#instructions = instructions;
    this.#status = status;
    this.#createdAt = createdAt;
    this.#updatedAt = updatedAt;
  }

  get id(): string {
    return this.#id;
  }

  get psychologistId(): string {
    return this.#psychologistId;
  }

  get childId(): string {
    return this.#childId;
  }

  get instructions(): string {
    return this.#instructions;
  }

  get status(): GuidelineStatus {
    return this.#status;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get updatedAt(): Date {
    return this.#updatedAt;
  }

  registrarPauta(): boolean {
    return this.validarPauta();
  }

  actualizarPauta(instructions: string): boolean {
    const instruction = new GuidelineInstruction(instructions);

    if (!instruction.validar()) {
      return false;
    }

    this.#instructions = instructions;
    this.#updatedAt = new Date();
    return true;
  }

  validarPauta(): boolean {
    const instruction = new GuidelineInstruction(this.#instructions);

    return (
      this.#psychologistId.trim().length > 0 &&
      this.#childId.trim().length > 0 &&
      instruction.validar()
    );
  }

  habilitarParaCuidadores(): void {
    if (this.validarPauta()) {
      this.#status = GuidelineStatus.ACTIVE;
      this.#updatedAt = new Date();
    }
  }

  consultarPauta(): ClinicalGuideline {
    return this;
  }
}

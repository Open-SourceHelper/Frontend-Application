import { GuidelineStatus } from './guideline-status';
import { GuidelineInstruction } from './guideline-instruction';

/** BC04 aggregate: clinical guidance authored for an assigned child. */
export class ClinicalGuideline {
  constructor(
    readonly id: string,
    readonly psychologistId: string,
    readonly childId: string,
    public instructions: string,
    public status: GuidelineStatus = GuidelineStatus.DRAFT,
    readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
    public title: string = 'Pauta clínica',
    public patientAssignmentId: string = ''
  ) {}

  validarPauta(): boolean {
    return this.psychologistId.trim().length > 0 &&
      this.childId.trim().length > 0 &&
      this.title.trim().length > 0 &&
      new GuidelineInstruction(this.instructions).validar();
  }

  registrarPauta(): boolean { return this.validarPauta(); }

  actualizarPauta(instructions: string): boolean {
    if (!new GuidelineInstruction(instructions).validar()) return false;
    this.instructions = instructions.trim();
    this.updatedAt = new Date();
    return true;
  }

  habilitarParaCuidadores(): void {
    if (this.validarPauta()) {
      this.status = GuidelineStatus.ACTIVE;
      this.updatedAt = new Date();
    }
  }

  desactivarPauta(): void {
    if (this.status === GuidelineStatus.ACTIVE) {
      this.status = GuidelineStatus.INACTIVE;
      this.updatedAt = new Date();
    }
  }

  consultarPauta(): ClinicalGuideline { return this; }
}

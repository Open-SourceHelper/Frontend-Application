import { CrisisSeverity } from './crisis-severity.enum';

export interface ObservationProps {
  id: string;
  childId: string;
  caregiverId: string;
  description: string;
  occurredAt: string;
  crisisSeverity?: CrisisSeverity | null;
}

export class Observation {
  readonly id: string;
  readonly childId: string;
  readonly caregiverId: string;
  readonly description: string;
  readonly occurredAt: string;
  readonly crisisSeverity: CrisisSeverity | null;

  constructor(props: ObservationProps) {
    if (!props.description.trim()) {
      throw new Error('La observación debe tener una descripción.');
    }

    if (!props.childId.trim() || !props.caregiverId.trim()) {
      throw new Error('Debe indicar el niño y el cuidador.');
    }

    if (Number.isNaN(Date.parse(props.occurredAt))) {
      throw new Error('La fecha de la observación no es válida.');
    }

    this.id = props.id;
    this.childId = props.childId;
    this.caregiverId = props.caregiverId;
    this.description = props.description.trim();
    this.occurredAt = props.occurredAt;
    this.crisisSeverity = props.crisisSeverity ?? null;
  }

  get isCrisis(): boolean {
    return this.crisisSeverity !== null;
  }
}

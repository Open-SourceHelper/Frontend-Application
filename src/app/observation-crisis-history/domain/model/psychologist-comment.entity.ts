export interface PsychologistCommentProps {
  id: string;
  observationId: string;
  psychologistId: string;
  content: string;
  createdAt: string;
}

export class PsychologistComment {
  readonly id: string;
  readonly observationId: string;
  readonly psychologistId: string;
  readonly content: string;
  readonly createdAt: string;

  constructor(props: PsychologistCommentProps) {
    if (!props.observationId.trim() || !props.psychologistId.trim()) {
      throw new Error('Debe indicar la observación y el psicólogo.');
    }

    if (!props.content.trim()) {
      throw new Error('El comentario no puede estar vacío.');
    }

    if (Number.isNaN(Date.parse(props.createdAt))) {
      throw new Error('La fecha del comentario no es válida.');
    }

    this.id = props.id;
    this.observationId = props.observationId;
    this.psychologistId = props.psychologistId;
    this.content = props.content.trim();
    this.createdAt = props.createdAt;
  }
}

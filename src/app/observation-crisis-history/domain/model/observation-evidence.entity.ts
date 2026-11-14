export interface ObservationEvidenceProps {
  id: string;
  observationId: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

export class ObservationEvidence {
  readonly id: string;
  readonly observationId: string;
  readonly fileName: string;
  readonly fileUrl: string;
  readonly uploadedAt: string;

  constructor(props: ObservationEvidenceProps) {
    if (!props.observationId.trim()) {
      throw new Error('La evidencia debe pertenecer a una observación.');
    }

    if (!props.fileName.trim() || !props.fileUrl.trim()) {
      throw new Error('Debe indicar el nombre y la URL del archivo.');
    }

    const url = new URL(props.fileUrl);

    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      throw new Error('El archivo debe tener una URL HTTP o HTTPS.');
    }

    if (Number.isNaN(Date.parse(props.uploadedAt))) {
      throw new Error('La fecha de carga no es válida.');
    }

    this.id = props.id;
    this.observationId = props.observationId;
    this.fileName = props.fileName.trim();
    this.fileUrl = url.href;
    this.uploadedAt = props.uploadedAt;
  }
}

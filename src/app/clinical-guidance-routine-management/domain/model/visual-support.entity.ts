import {BaseEntity} from '../../../shared/domain/model/base-entity';

/**
 * Represents an image or pictogram associated with a routine activity (US27).
 */
export class VisualSupport implements BaseEntity {
  /**
   * File formats accepted by US27 (JPG / PNG).
   */
  static readonly ALLOWED_FORMATS = ['image/jpeg', 'image/png'];

  #id: number;
  #activityId: number;
  #fileUrl: string;
  #fileFormat: string;
  #createdAt: Date;
  #status: string;

  /**
   * Creates a new visual support.
   * @param props - Initialization values.
   */
  constructor(props: { id: number; activityId: number; fileUrl: string; fileFormat: string; createdAt?: Date; status?: string }) {
    this.#id = props.id;
    this.#activityId = props.activityId;
    this.#fileUrl = props.fileUrl;
    this.#fileFormat = props.fileFormat;
    this.#createdAt = props.createdAt ?? new Date();
    this.#status = props.status ?? 'ACTIVE';
  }

  get id(): number {
    return this.#id;
  }

  set id(value: number) {
    this.#id = value;
  }

  get activityId(): number {
    return this.#activityId;
  }

  get fileUrl(): string {
    return this.#fileUrl;
  }

  get fileFormat(): string {
    return this.#fileFormat;
  }

  get status(): string { return this.#status; }

  get uploadedAt(): Date { return this.#createdAt; }

  get createdAt(): Date {
    return this.#createdAt;
  }

  /**
   * Validates that the file format is JPG or PNG.
   * @returns True when the format is allowed.
   */
  validarFormato(): boolean {
    return VisualSupport.ALLOWED_FORMATS.includes(this.#fileFormat);
  }

  /**
   * Associates this visual support with an activity.
   * @param activityId - Identifier of the activity.
   */
  asociarActividad(activityId: number): void {
    this.#activityId = activityId;
  }
}

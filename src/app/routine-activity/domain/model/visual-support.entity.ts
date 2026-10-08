import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a visual support associated with a routine activity.
 */
export class VisualSupport implements BaseEntity {
  #id: number;
  #activityId: number;
  #name: string;
  #resourceUrl: string;

  constructor(
    id: number,
    activityId: number,
    name: string,
    resourceUrl: string
  ) {
    this.#id = id;
    this.#activityId = activityId;
    this.#name = name;
    this.#resourceUrl = resourceUrl;
  }

  get id(): number {
    return this.#id;
  }

  get activityId(): number {
    return this.#activityId;
  }

  get name(): string {
    return this.#name;
  }

  get resourceUrl(): string {
    return this.#resourceUrl;
  }

  consultarRecurso(): string {
    return this.#resourceUrl;
  }
}

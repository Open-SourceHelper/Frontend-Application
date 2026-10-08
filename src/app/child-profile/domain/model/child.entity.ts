import {DateTime} from '../../../shared/domain/model/date-time';

export class Child {
  #id: string;
  #parentId: string;
  #firstName: string;
  #lastName: string;
  #birthDate: Date;
  #createdAt: DateTime;

  constructor(id: string, parentId: string,
              firstName: string, lastName: string,
              birtDate: Date = new Date(), createdAt: DateTime) {
    this.#id = id;
    this.#parentId = parentId;
    this.#firstName = firstName;
    this.#lastName = lastName;
    this.#birthDate = birtDate;
    this.#createdAt = createdAt;
  }


  get id(): string {
    return this.#id;
  }
  get parentId(): string {
    return this.#parentId;
  }
  get firstName(): string {
    return this.#firstName;
  }
  get lastName(): string {
    return this.#lastName;
  }
  get birthDate(): Date {
    return this.#birthDate;
  }
  get createdAt(): DateTime {
    return this.#createdAt;
  }
}

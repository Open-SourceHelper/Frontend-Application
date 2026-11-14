export class CareNetwork {
  #id: string;
  #parentId: string;
  #childId: string;
  #name: string;

  constructor(id: string, parentId: string, childId: string, name: string) {
    this.#id = id;
    this.#parentId = parentId;
    this.#childId = childId;
    this.#name = name;
  }

  get id(): string {
    return this.#id;
  }
  get parentId(): string {
    return this.#parentId;
  }
  get childId(): string {
    return this.#childId;
  }
  get name(): string {
    return this.#name;
  }

  belongsTo(parentId: string): boolean {
    return this.#parentId === parentId;
  }
}

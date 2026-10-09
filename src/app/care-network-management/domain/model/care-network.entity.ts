
/**
 * Aggregate Root for care network management.
 */
export class CareNetwork {
  constructor(
    readonly id: string,
    readonly parentId: string,
    readonly childId: string,
    readonly name: string
  ) {}

  belongsTo(parentId: string): boolean {
    return this.parentId === parentId;
  }
}

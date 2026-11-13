/**
 * Lifecycle states of a routine.
 *
 * @remarks
 * ACTIVE / INACTIVE come from the BC04 class diagram.
 * DRAFT is required by US28 ("genera una copia exacta en estado de borrador").
 */
export enum RoutineStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

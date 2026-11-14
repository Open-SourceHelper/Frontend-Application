/**
 * Domain event raised when a clinical guideline is created.
 */
export class ClinicalGuidelineCreated {
  constructor(
    public readonly guidelineId: string,
    public readonly psychologistId: string,
    public readonly childId: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}

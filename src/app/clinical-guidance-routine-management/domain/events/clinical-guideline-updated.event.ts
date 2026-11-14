/**
 * Domain event raised when a clinical guideline is updated.
 */
export class ClinicalGuidelineUpdated {
  constructor(
    public readonly guidelineId: string,
    public readonly occurredAt: Date = new Date()
  ) {}
}

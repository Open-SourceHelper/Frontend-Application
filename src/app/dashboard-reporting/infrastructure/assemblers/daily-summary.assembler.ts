import { DailySummary } from '../../domain/model/daily-summary';
import { DailySummaryResource } from '../resources/daily-summary.resource';

export class DailySummaryAssembler {
  static toEntityFromResource(value: DailySummaryResource): DailySummary {
    return {
      childId: value.childId,
      date: value.date,
      totalActivities: value.totalActivities,
      completedActivities: value.completedActivities,
      status: value.status,
      activities: value.activities ?? [],
      availableGuides: value.availableGuides ?? 0,
      recentObservations: value.recentObservations ?? 0
    };
  }
}

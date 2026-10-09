import { DailyActivity } from '../../domain/model/daily-summary';

export interface DailySummaryResource {
  id?: string;
  childId: string;
  date: string;
  totalActivities: number;
  completedActivities: number;
  status: string;
  activities?: DailyActivity[];
  availableGuides?: number;
  recentObservations?: number;
}

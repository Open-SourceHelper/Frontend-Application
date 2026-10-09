/** Read Model: información de otros contextos sin modificar su origen. */
export interface DailyActivity {
  id: string;
  title: string;
  scheduledTime?: string;
  status: 'PENDING' | 'COMPLETED' | 'SKIPPED';
}

export interface DailySummary {
  childId: string;
  date: string;
  totalActivities: number;
  completedActivities: number;
  status: string;
  activities: DailyActivity[];
  availableGuides: number;
  recentObservations: number;
}

export function completionPercentage(summary: DailySummary): number {
  if (summary.totalActivities === 0) return 0;

  return Math.min(
    100,
    Math.round(summary.completedActivities / summary.totalActivities * 100)
  );
}

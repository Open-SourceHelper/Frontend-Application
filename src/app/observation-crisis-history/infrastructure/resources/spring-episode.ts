import { Observation, ObservationProps } from '../../domain/model/observation.entity';
import { PsychologistComment } from '../../domain/model/psychologist-comment.entity';

export interface SpringEpisode extends Omit<ObservationProps,
  'alertId' | 'durationMinutes' | 'trigger' | 'helped' | 'reviewedAt' | 'reviewedBy'> {
  alertId: string | null;
  durationMinutes: number | null;
  trigger: string | null;
  helped: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  comments: { id: string; authorId: string; text: string; createdAt: string }[];
}

export function episodePath(childId: string, id?: string): string {
  const collection = '/children/' + encodeURIComponent(childId) + '/episodes';
  return id ? collection + '/' + encodeURIComponent(id) : collection;
}

export function toObservation(episode: SpringEpisode): Observation {
  return new Observation({
    ...episode,
    alertId: episode.alertId ?? undefined,
    durationMinutes: episode.durationMinutes ?? undefined,
    trigger: episode.trigger ?? undefined,
    helped: episode.helped ?? undefined,
    reviewedAt: episode.reviewedAt ?? undefined,
    reviewedBy: episode.reviewedBy ?? undefined,
  });
}

export function toComments(episode: SpringEpisode): PsychologistComment[] {
  return episode.comments.map(comment => new PsychologistComment({
    id: comment.id,
    observationId: episode.id,
    psychologistId: comment.authorId,
    content: comment.text,
    createdAt: comment.createdAt,
  }));
}

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { PsychologistComment } from '../../domain/model/psychologist-comment.entity';
import { PsychologistCommentAssembler } from '../assemblers/observation.assembler';
import type { PsychologistCommentResource } from '../resources/observation.resource';
import { environment } from '../../../../environments/environment';

import { LocalSpringApi } from '../../../shared/infrastructure/local-spring-api';
import { episodePath, SpringEpisode, toComments } from '../resources/spring-episode';

@Injectable({
  providedIn: 'root'
})
export class PsychologistCommentService {
  private readonly http = inject(HttpClient);
  private readonly spring = inject(LocalSpringApi);

  private readonly endpoint =
    `${environment.platformProviderApiBaseUrl}/psychologistComments`;

  getByObservationId(
    observationId: string, childId: string
  ): Observable<PsychologistComment[]> {
    if (this.spring.session) {
      return this.spring.request<SpringEpisode>('GET', episodePath(childId, observationId)).pipe(map(toComments));
    }
    return this.http
      .get<PsychologistCommentResource[]>(this.endpoint, {
        params: { observationId }
      })
      .pipe(
        map(resources =>
          resources.map(resource =>
            PsychologistCommentAssembler.toEntityFromResource(resource)
          )
        )
      );
  }

  create(
    comment: PsychologistComment, childId: string
  ): Observable<PsychologistComment> {
    if (this.spring.session) {
      return this.spring.request<SpringEpisode>(
        'POST', episodePath(childId, comment.observationId) + '/comments', { text: comment.content },
      ).pipe(map(episode => {
        const saved = toComments(episode).at(-1);
        if (!saved) throw new Error('La respuesta no incluyó el comentario.');
        return saved;
      }));
    }
    const resource =
      PsychologistCommentAssembler.toResourceFromEntity(comment);

    return this.http
      .post<PsychologistCommentResource>(this.endpoint, resource)
      .pipe(
        map(response =>
          PsychologistCommentAssembler.toEntityFromResource(response)
        )
      );
  }
}

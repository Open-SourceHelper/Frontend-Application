import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { PsychologistComment } from '../../domain/model/psychologist-comment.entity';
import { PsychologistCommentAssembler } from '../assemblers/observation.assembler';
import type { PsychologistCommentResource } from '../resources/observation.resource';

@Injectable({
  providedIn: 'root'
})
export class PsychologistCommentService {
  private readonly http = inject(HttpClient);

  private readonly endpoint =
    'http://localhost:3000/psychologistComments';

  getByObservationId(
    observationId: string
  ): Observable<PsychologistComment[]> {
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
    comment: PsychologistComment
  ): Observable<PsychologistComment> {
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

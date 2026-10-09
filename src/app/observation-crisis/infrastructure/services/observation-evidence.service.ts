import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { ObservationEvidence } from '../../domain/model/observation-evidence.entity';
import { ObservationEvidenceAssembler } from '../assemblers/observation.assembler';
import type { ObservationEvidenceResource } from '../resources/observation.resource';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ObservationEvidenceService {
  private readonly http = inject(HttpClient);

  private readonly endpoint =
    `${environment.platformProviderApiBaseUrl}/observationEvidences`;

  getByObservationId(
    observationId: string
  ): Observable<ObservationEvidence[]> {
    return this.http
      .get<ObservationEvidenceResource[]>(this.endpoint, {
        params: { observationId }
      })
      .pipe(
        map(resources =>
          resources.map(resource =>
            ObservationEvidenceAssembler.toEntityFromResource(resource)
          )
        )
      );
  }

  create(
    evidence: ObservationEvidence
  ): Observable<ObservationEvidence> {
    const resource =
      ObservationEvidenceAssembler.toResourceFromEntity(evidence);

    return this.http
      .post<ObservationEvidenceResource>(this.endpoint, resource)
      .pipe(
        map(response =>
          ObservationEvidenceAssembler.toEntityFromResource(response)
        )
      );
  }
}

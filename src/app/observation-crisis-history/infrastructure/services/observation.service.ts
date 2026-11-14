import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { Observation } from '../../domain/model/observation.entity';
import { ObservationAssembler } from '../assemblers/observation.assembler';
import type { ObservationResource } from '../resources/observation.resource';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ObservationService {
  private readonly http = inject(HttpClient);

  private readonly endpoint =
    `${environment.platformProviderApiBaseUrl}/observations`;

  getByChildId(childId: string): Observable<Observation[]> {
    return this.http
      .get<ObservationResource[]>(this.endpoint, {
        params: { childId }
      })
      .pipe(
        map(resources =>
          ObservationAssembler.toEntitiesFromResponse(resources)
        )
      );
  }

  getById(id: string): Observable<Observation> {
    return this.http
      .get<ObservationResource>(
        `${this.endpoint}/${encodeURIComponent(id)}`
      )
      .pipe(
        map(resource =>
          ObservationAssembler.toEntityFromResource(resource)
        )
      );
  }

  create(observation: Observation): Observable<Observation> {
    const resource =
      ObservationAssembler.toResourceFromEntity(observation);

    return this.http
      .post<ObservationResource>(this.endpoint, resource)
      .pipe(
        map(response =>
          ObservationAssembler.toEntityFromResource(response)
        )
      );
  }

  update(observation: Observation): Observable<Observation> {
    const resource =
      ObservationAssembler.toResourceFromEntity(observation);

    return this.http
      .put<ObservationResource>(
        `${this.endpoint}/${encodeURIComponent(observation.id)}`,
        resource
      )
      .pipe(
        map(response =>
          ObservationAssembler.toEntityFromResource(response)
        )
      );
  }
}

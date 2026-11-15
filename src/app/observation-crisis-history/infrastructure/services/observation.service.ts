import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, expand, map, Observable, reduce } from 'rxjs';

import { Observation } from '../../domain/model/observation.entity';
import { ObservationAssembler } from '../assemblers/observation.assembler';
import type { ObservationResource } from '../resources/observation.resource';
import { environment } from '../../../../environments/environment';

import { LocalSpringApi } from '../../../shared/infrastructure/local-spring-api';
import { episodePath, SpringEpisode, toObservation } from '../resources/spring-episode';

@Injectable({
  providedIn: 'root'
})
export class ObservationService {
  private readonly http = inject(HttpClient);
  private readonly spring = inject(LocalSpringApi);

  private readonly endpoint =
    `${environment.platformProviderApiBaseUrl}/observations1`;

  getByChildId(childId: string): Observable<Observation[]> {
    if (this.spring.session) {
      const size = 100;
      const fetchPage = (page: number) =>
        this.spring.request<SpringEpisode[]>('GET', episodePath(childId) + '?size=' + size + '&page=' + page);
      return fetchPage(0).pipe(
        expand((page, index) => page.length === size ? fetchPage(index + 1) : EMPTY),
        reduce((observations, page) => observations.concat(page.map(toObservation)), [] as Observation[]),
      );
    }
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

  getById(id: string, childId: string): Observable<Observation> {
    if (this.spring.session) {
      return this.spring.request<SpringEpisode>('GET', episodePath(childId, id)).pipe(map(toObservation));
    }
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
    if (this.spring.session) {
      const { alertId, description, occurredAt, crisisSeverity, durationMinutes, trigger, helped } = observation;
      return this.spring.request<SpringEpisode>('POST', episodePath(observation.childId), {
        alertId, description, occurredAt, crisisSeverity, durationMinutes, trigger, helped,
      }).pipe(map(toObservation));
    }
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

  review(observation: Observation): Observable<Observation> {
    if (this.spring.session) {
      return this.spring.request<SpringEpisode>(
        'PUT', episodePath(observation.childId, observation.id) + '/review',
      ).pipe(map(toObservation));
    }
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

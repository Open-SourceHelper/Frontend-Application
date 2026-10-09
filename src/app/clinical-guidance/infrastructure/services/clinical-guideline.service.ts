import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { ClinicalGuideline } from '../../domain/model/clinical-guideline.entity';
import { ClinicalGuidelineResource } from '../resources/clinical-guideline.resource';
import { ClinicalGuidelineAssembler } from '../assemblers/clinical-guideline.assembler';

@Injectable({
  providedIn: 'root'
})
export class ClinicalGuidelineService {
  private readonly http = inject(HttpClient);
  private readonly endpointUrl = 'http://localhost:3000/clinicalGuidelines';

  getAll(): Observable<ClinicalGuideline[]> {
    return this.http.get<ClinicalGuidelineResource[]>(this.endpointUrl).pipe(
      map(resources =>
        ClinicalGuidelineAssembler.toEntitiesFromResponse(resources)
      )
    );
  }

  getById(id: string): Observable<ClinicalGuideline> {
    return this.http
      .get<ClinicalGuidelineResource>(
        `${this.endpointUrl}/${encodeURIComponent(id)}`
      )
      .pipe(
        map(resource =>
          ClinicalGuidelineAssembler.toEntityFromResource(resource)
        )
      );
  }

  create(guideline: ClinicalGuideline): Observable<ClinicalGuideline> {
    const resource = ClinicalGuidelineAssembler.toResourceFromEntity(guideline);

    return this.http
      .post<ClinicalGuidelineResource>(this.endpointUrl, resource)
      .pipe(
        map(created =>
          ClinicalGuidelineAssembler.toEntityFromResource(created)
        )
      );
  }

  update(guideline: ClinicalGuideline): Observable<ClinicalGuideline> {
    const resource = ClinicalGuidelineAssembler.toResourceFromEntity(guideline);

    return this.http
      .put<ClinicalGuidelineResource>(
        `${this.endpointUrl}/${encodeURIComponent(guideline.id)}`,
        resource
      )
      .pipe(
        map(updated =>
          ClinicalGuidelineAssembler.toEntityFromResource(updated)
        )
      );
  }
}

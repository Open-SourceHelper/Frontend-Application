import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ClinicalProfile } from '../../domain/model/clinical-profile.entity';
import { ClinicalProfileResource } from '../responses/clinical-response';
import { ClinicalAssembler } from '../assemblers/clinical-assembler';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClinicalService {
  private readonly http = inject(HttpClient);
  private readonly endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderClinicalProfileEndpointPath}`;

  getAll(): Observable<ClinicalProfile[]> {
    return this.http.get<ClinicalProfileResource[]>(this.endpointUrl).pipe(
      map(resources =>
        ClinicalAssembler.toEntitiesFromResponse(resources)
      )
    );
  }

  getById(
    clinicalId: string
  ): Observable<ClinicalProfile[]> {
    return this.http
      .get<ClinicalProfileResource[]>(this.endpointUrl, {
        params: { clinicalId }
      })
      .pipe(
        map(resources =>
          resources.map(resource =>
            ClinicalAssembler.toEntityFromResource(resource)
          )
        )
      );
  }

  create(
    clinical: ClinicalProfile
  ): Observable<ClinicalProfile> {
    const resource =
      ClinicalAssembler.toResourceFromEntity(clinical);

    return this.http
      .post<ClinicalProfileResource>(this.endpointUrl, resource)
      .pipe(
        map(response =>
          ClinicalAssembler.toEntityFromResource(response)
        )
      );
  }

  update(clinical: ClinicalProfile): Observable<ClinicalProfile> {
    const resource = ClinicalAssembler.toResourceFromEntity(clinical);

    return this.http
      .put<ClinicalProfileResource>(
        `${this.endpointUrl}/${encodeURIComponent(clinical.id)}`,
        resource
      )
      .pipe(
        map(updated =>
          ClinicalAssembler.toEntityFromResource(updated)
        )
      );
  }
}

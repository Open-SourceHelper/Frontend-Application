import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CaregiverAuthorization } from '../../domain/model/caregiver-authorization.entity';
import { CaregiverResource } from '../responses/caregiver-response';
import { CaregiverAssembler } from '../assemblers/caregiver-assembler';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CaregiverService {
  private readonly http = inject(HttpClient);
  private readonly endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderCaregiverAuthorizationEndpointPath}`;

  getAll(): Observable<CaregiverAuthorization[]> {
    return this.http.get<CaregiverResource[]>(this.endpointUrl).pipe(
      map(resources =>
        CaregiverAssembler.toEntitiesFromResponse(resources)
      )
    );
  }

  getById(
    caregiverId: string
  ): Observable<CaregiverAuthorization[]> {
    return this.http
      .get<CaregiverResource[]>(this.endpointUrl, {
        params: { caregiverId }
      })
      .pipe(
        map(resources =>
          resources.map(resource =>
            CaregiverAssembler.toEntityFromResource(resource)
          )
        )
      );
  }

  create(
    caregiver: CaregiverAuthorization
  ): Observable<CaregiverAuthorization> {
    const resource =
      CaregiverAssembler.toResourceFromEntity(caregiver);

    return this.http
      .post<CaregiverResource>(this.endpointUrl, resource)
      .pipe(
        map(response =>
          CaregiverAssembler.toEntityFromResource(response)
        )
      );
  }

  update(caregiver: CaregiverAuthorization): Observable<CaregiverAuthorization> {
    const resource = CaregiverAssembler.toResourceFromEntity(caregiver);

    return this.http
      .put<CaregiverResource>(
        `${this.endpointUrl}/${encodeURIComponent(caregiver.id)}`,
        resource
      )
      .pipe(
        map(updated =>
          CaregiverAssembler.toEntityFromResource(updated)
        )
      );
  }
}

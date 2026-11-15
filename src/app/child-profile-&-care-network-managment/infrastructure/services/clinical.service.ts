
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { ClinicalProfile } from '../../domain/model/clinical-profile.entity';
import { ClinicalProfileResource } from '../responses/clinical-response';
import { ClinicalAssembler } from '../assemblers/clinical-assembler';
import { environment } from '../../../../environments/environment';
import { LocalSpringApi } from '../../../shared/infrastructure/local-spring-api';
import { ChildService } from './child.service';

interface SpringClinicalProfile {
  id: number | null;
  specialNeeds: string | null;
  triggers: string | null;
  regulators: string | null;
  updateTime: string | null;
}

function profilePath(childId: string): string {
  return '/children/' + encodeURIComponent(childId) + '/clinical-profile';
}

function toClinical(profile: SpringClinicalProfile, childId: string): ClinicalProfile {
  return ClinicalAssembler.toEntityFromResource({
    id: childId,
    childId,
    specialNeeds: profile.specialNeeds ?? '',
    triggers: profile.triggers ?? '',
    regulators: profile.regulators ?? '',
    updatedAt: profile.updateTime ?? undefined,
  });
}

@Injectable({
  providedIn: 'root'
})
export class ClinicalService {
  private readonly http = inject(HttpClient);
  private readonly spring = inject(LocalSpringApi);
  private readonly children = inject(ChildService);
  private readonly endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderClinicalProfileEndpointPath}`;

  getAll(): Observable<ClinicalProfile[]> {
    if (this.spring.session) {
      return this.children.getAll().pipe(switchMap(children => children.length
        ? forkJoin(children.map(child => this.spring.request<SpringClinicalProfile>('GET', profilePath(child.id))
          .pipe(map(profile => toClinical(profile, child.id)))))
        : of([])));
    }
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
    if (this.spring.session) return this.update(clinical);
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
    if (this.spring.session) {
      const { specialNeeds, triggers, regulators } = clinical;
      return this.spring.request<SpringClinicalProfile>('PUT', profilePath(clinical.childId), {
        specialNeeds, triggers, regulators,
      }).pipe(map(profile => toClinical(profile, clinical.childId)));
    }
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

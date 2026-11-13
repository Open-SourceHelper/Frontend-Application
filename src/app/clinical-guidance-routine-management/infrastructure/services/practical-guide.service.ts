import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { PracticalGuide } from '../../domain/model/practical-guide.entity';
import { PracticalGuideResource } from '../resources/practical-guide.resource';
import { PracticalGuideAssembler } from '../assemblers/practical-guide.assembler';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PracticalGuideService {
  private readonly http = inject(HttpClient);

  private readonly endpointUrl =
    `${environment.platformProviderApiBaseUrl}/practicalGuides`;

  getAll(): Observable<PracticalGuide[]> {
    return this.http
      .get<PracticalGuideResource[]>(this.endpointUrl)
      .pipe(
        map(resources =>
          PracticalGuideAssembler.toEntitiesFromResponse(resources)
        )
      );
  }

  getById(id: string): Observable<PracticalGuide> {
    return this.http
      .get<PracticalGuideResource>(`${this.endpointUrl}/${id}`)
      .pipe(
        map(resource =>
          PracticalGuideAssembler.toEntityFromResource(resource)
        )
      );
  }
}

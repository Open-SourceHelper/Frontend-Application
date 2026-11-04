
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { CareNetwork } from '../../domain/model/care-network.entity';
import { CareNetworkResource } from '../resources/care-network.resource';
import { CareNetworkAssembler } from '../assemblers/care-network.assembler';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CareNetworkService {

  private readonly http = inject(HttpClient);

  private readonly endpointUrl =
    `${environment.platformProviderApiBaseUrl}/careNetworks`;

  getAll(): Observable<CareNetwork[]> {
    return this.http
      .get<CareNetworkResource[]>(this.endpointUrl)
      .pipe(
        map(resources =>
          CareNetworkAssembler.toEntitiesFromResponse(resources)
        )
      );
  }

  getById(id: string): Observable<CareNetwork> {
    return this.http
      .get<CareNetworkResource>(
        `${this.endpointUrl}/${encodeURIComponent(id)}`
      )
      .pipe(
        map(resource =>
          CareNetworkAssembler.toEntityFromResource(resource)
        )
      );
  }

  create(network: CareNetwork): Observable<CareNetwork> {
    const resource =
      CareNetworkAssembler.toResourceFromEntity(network);

    return this.http
      .post<CareNetworkResource>(
        this.endpointUrl,
        resource
      )
      .pipe(
        map(created =>
          CareNetworkAssembler.toEntityFromResource(created)
        )
      );
  }
}

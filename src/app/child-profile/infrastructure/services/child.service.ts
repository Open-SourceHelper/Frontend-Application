import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Child } from '../../domain/model/child.entity';
import { ChildResource } from '../responses/child-response';
import { ChildAssembler } from '../assemblers/child-assembler';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChildService {
  private readonly http = inject(HttpClient);
  private readonly endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderChildEndpointPath}`;

  getAll(): Observable<Child[]> {
    return this.http.get<ChildResource[]>(this.endpointUrl).pipe(
      map(resources =>
        ChildAssembler.toEntitiesFromResponse(resources)
      )
    );
  }

  getById(
    childId: string
  ): Observable<Child[]> {
    return this.http
      .get<ChildResource[]>(this.endpointUrl, {
        params: { childId }
      })
      .pipe(
        map(resources =>
          resources.map(resource =>
            ChildAssembler.toEntityFromResource(resource)
          )
        )
      );
  }

  create(
    child: Child
  ): Observable<Child> {
    const resource =
      ChildAssembler.toResourceFromEntity(child);

    return this.http
      .post<ChildResource>(this.endpointUrl, resource)
      .pipe(
        map(response =>
          ChildAssembler.toEntityFromResource(response)
        )
      );
  }

  update(child: Child): Observable<Child> {
    const resource = ChildAssembler.toResourceFromEntity(child);

    return this.http
      .put<ChildResource>(
        `${this.endpointUrl}/${encodeURIComponent(child.id)}`,
        resource
      )
      .pipe(
        map(updated =>
          ChildAssembler.toEntityFromResource(updated)
        )
      );
  }
}


import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Child } from '../../domain/model/child.entity';
import { ChildResource } from '../responses/child-response';
import { ChildAssembler } from '../assemblers/child-assembler';
import { environment } from '../../../../environments/environment';
import { UserRole } from '../../../identity-access/domain/model/user-role.enum';
import { LocalSpringApi } from '../../../shared/infrastructure/local-spring-api';

type SpringChild = Omit<ChildResource, 'id' | 'parentId'> & { id: number; parentId: number };

function toChild(child: SpringChild): Child {
  return ChildAssembler.toEntityFromResource({ ...child, id: String(child.id), parentId: String(child.parentId) });
}

function childPayload(child: Child) {
  const date = child.birthDate;
  return {
    firstName: child.firstName,
    lastName: child.lastName,
    birthDate: new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10),
  };
}

@Injectable({
  providedIn: 'root'
})
export class ChildService {
  private readonly http = inject(HttpClient);
  private readonly spring = inject(LocalSpringApi);
  private readonly endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderChildEndpointPath}`;

  getAll(): Observable<Child[]> {
    const user = this.spring.session;
    if (user?.localSpring) {
      if (user.role === UserRole.PARENT) {
        return this.spring.request<SpringChild[]>('GET', '/children').pipe(map(items => items.map(toChild)));
      }
      return this.spring.request<SpringChild>('GET', '/children/' + user.localSpring.childId)
        .pipe(map(child => [toChild(child)]));
    }
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
    if (this.spring.session) {
      return this.spring.request<SpringChild>('POST', '/children', childPayload(child)).pipe(map(toChild));
    }
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
    if (this.spring.session) {
      return this.spring.request<SpringChild>('PUT', '/children/' + encodeURIComponent(child.id), childPayload(child))
        .pipe(map(toChild));
    }
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

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RoutineActivity } from '../../domain/model/routine-activity.entity';
import { RoutineActivityAssembler } from '../assemblers/routine-activity-assembler';
import { RoutineActivityResource } from '../resources/routine-activity.resource';

@Injectable({ providedIn: 'root' })
export class RoutineActivityResourceService {
  private readonly http = inject(HttpClient);
  private readonly assembler = new RoutineActivityAssembler();
  private readonly endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderRoutineActivitiesEndpointPath}`;

  getAll(): Observable<RoutineActivity[]> {
    return this.http.get<RoutineActivityResource[]>(this.endpointUrl).pipe(
      map(items => items.map(item => this.assembler.toEntityFromResource(item)))
    );
  }

  create(entity: RoutineActivity): Observable<RoutineActivity> {
    const { id, ...payload } = this.assembler.toResourceFromEntity(entity);
    return this.http.post<RoutineActivityResource>(this.endpointUrl, payload).pipe(
      map(resource => this.assembler.toEntityFromResource(resource))
    );
  }

  update(entity: RoutineActivity): Observable<RoutineActivity> {
    return this.http.put<RoutineActivityResource>(`${this.endpointUrl}/${entity.id}`,
      this.assembler.toResourceFromEntity(entity)).pipe(
      map(resource => this.assembler.toEntityFromResource(resource))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpointUrl}/${id}`);
  }
}

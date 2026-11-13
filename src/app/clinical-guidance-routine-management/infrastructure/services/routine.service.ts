import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Routine } from '../../domain/model/routine.entity';
import { RoutineAssembler } from '../assemblers/routine-assembler';
import { RoutineResource } from '../resources/routine.resource';

@Injectable({ providedIn: 'root' })
export class RoutineService {
  private readonly http = inject(HttpClient);
  private readonly assembler = new RoutineAssembler();
  private readonly endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderRoutinesEndpointPath}`;

  getAll(): Observable<Routine[]> {
    return this.http.get<RoutineResource[]>(this.endpointUrl).pipe(
      map(items => items.map(item => this.assembler.toEntityFromResource(item)))
    );
  }

  create(entity: Routine): Observable<Routine> {
    // json-server assigns numeric identifiers; do not persist the draft id=0.
    const { id, ...payload } = this.assembler.toResourceFromEntity(entity);
    return this.http.post<RoutineResource>(this.endpointUrl, payload).pipe(
      map(resource => this.assembler.toEntityFromResource(resource))
    );
  }

  update(entity: Routine): Observable<Routine> {
    const payload = this.assembler.toResourceFromEntity(entity);
    return this.http.put<RoutineResource>(`${this.endpointUrl}/${entity.id}`, payload).pipe(
      map(resource => this.assembler.toEntityFromResource(resource))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpointUrl}/${id}`);
  }
}

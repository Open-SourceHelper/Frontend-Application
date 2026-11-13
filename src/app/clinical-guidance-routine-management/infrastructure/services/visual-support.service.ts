import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { VisualSupport } from '../../domain/model/visual-support.entity';
import { VisualSupportAssembler } from '../assemblers/visual-support-assembler';
import { VisualSupportResource } from '../resources/visual-support.resource';

@Injectable({ providedIn: 'root' })
export class VisualSupportService {
  private readonly http = inject(HttpClient);
  private readonly assembler = new VisualSupportAssembler();
  private readonly endpointUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderVisualSupportsEndpointPath}`;

  getAll(): Observable<VisualSupport[]> {
    return this.http.get<VisualSupportResource[]>(this.endpointUrl).pipe(
      map(items => items.map(item => this.assembler.toEntityFromResource(item)))
    );
  }

  create(entity: VisualSupport): Observable<VisualSupport> {
    const { id, ...payload } = this.assembler.toResourceFromEntity(entity);
    return this.http.post<VisualSupportResource>(this.endpointUrl, payload).pipe(
      map(resource => this.assembler.toEntityFromResource(resource))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpointUrl}/${id}`);
  }
}

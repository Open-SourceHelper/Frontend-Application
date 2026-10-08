import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { RoutineResource } from '../resources/routine-resource';
import { RoutineResponse } from '../assemblers/routine-assembler';

@Injectable({
  providedIn: 'root'
})
export class RoutineApiService {

  private readonly baseUrl = 'http://localhost:3000/routines';

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<RoutineResponse> {
    return this.http
      .get<RoutineResource[]>(this.baseUrl)
      .pipe(
        map(routines => ({
          content: routines
        }))
      );
  }

  getById(id: number): Observable<RoutineResource> {
    return this.http.get<RoutineResource>(`${this.baseUrl}/${id}`);
  }

  create(resource: RoutineResource): Observable<RoutineResource> {
    return this.http.post<RoutineResource>(this.baseUrl, resource);
  }

  update(id: number, resource: RoutineResource): Observable<RoutineResource> {
    return this.http.put<RoutineResource>(
      `${this.baseUrl}/${id}`,
      resource
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

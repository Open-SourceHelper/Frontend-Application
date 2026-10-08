import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { PatientAssignment } from '../../domain/model/patient-assignment.entity';
import { PatientAssignmentResource } from '../resources/patient-assignment.resource';
import { PatientAssignmentAssembler } from '../assemblers/patient-assignment.assembler';

@Injectable({
  providedIn: 'root'
})
export class PatientAssignmentService {

  private readonly http = inject(HttpClient);

  private readonly endpointUrl =
    'http://localhost:3000/patientAssignments';

  getAll(): Observable<PatientAssignment[]> {
    return this.http
      .get<PatientAssignmentResource[]>(this.endpointUrl)
      .pipe(
        map(resources =>
          PatientAssignmentAssembler.toEntitiesFromResponse(resources)
        )
      );
  }

  getById(id: string): Observable<PatientAssignment> {
    return this.http
      .get<PatientAssignmentResource>(`${this.endpointUrl}/${id}`)
      .pipe(
        map(resource =>
          PatientAssignmentAssembler.toEntityFromResource(resource)
        )
      );
  }

  create(
    assignment: PatientAssignment
  ): Observable<PatientAssignment> {
    return this.http
      .post<PatientAssignmentResource>(
        this.endpointUrl,
        PatientAssignmentAssembler.toResourceFromEntity(assignment)
      )
      .pipe(
        map(resource =>
          PatientAssignmentAssembler.toEntityFromResource(resource)
        )
      );
  }
}

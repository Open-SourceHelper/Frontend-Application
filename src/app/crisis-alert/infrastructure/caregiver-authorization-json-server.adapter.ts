import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CaregiverAuthorizationPort } from '../domain/ports/caregiver-authorization.port';

interface CaregiverAuthorizationDto {
  caregiverId: string;
  status: string;
  revokedAt: string | null;
}

@Injectable()
export class CaregiverAuthorizationJsonServerAdapter extends CaregiverAuthorizationPort {
  private readonly http = inject(HttpClient);

  findActiveCaregiverIds(childId: string): Observable<string[]> {
    return this.http.get<CaregiverAuthorizationDto[]>(
      'http://localhost:3000/caregiverAuthorizations',
      { params: new HttpParams().set('childId', childId) }
    ).pipe(
      map(authorizations => [...new Set(
        authorizations
          .filter(item => item.status.toUpperCase() === 'ACTIVE' && !item.revokedAt)
          .map(item => item.caregiverId)
      )])
    );
  }
}

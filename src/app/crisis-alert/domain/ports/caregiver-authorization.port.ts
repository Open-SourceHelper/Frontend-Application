import { Observable } from 'rxjs';

// Puerto de BC03 hacia permisos de BC02: evita acoplarse a sus entidades y UI.
export abstract class CaregiverAuthorizationPort {
  abstract findActiveCaregiverIds(childId: string): Observable<string[]>;
}

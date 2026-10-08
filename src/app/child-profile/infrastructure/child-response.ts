import {BaseResponse} from '../../shared/infrastructure/base-response';
import {DateTime} from '../../shared/domain/model/date-time';

export interface ChildResource {
  id: string;
  parentId: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  createdAt: DateTime;
}

export interface ChildResponse extends BaseResponse {
  children: ChildResource[];
}

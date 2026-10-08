import {BaseResponse} from '../../../shared/infrastructure/base-response';

export interface ChildResource {
  id: string;
  parentId: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  createdAt: string;
}

export interface ChildResponse extends BaseResponse {
  children: ChildResource[];
}

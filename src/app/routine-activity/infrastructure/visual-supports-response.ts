import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a visual support.
 */
export interface VisualSupportResource extends BaseResource {
  id: number;
  activityId: number;
  fileUrl: string;
  fileFormat: string;
  createdAt: string;
}

/**
 * Response envelope for visual support collection queries.
 */
export interface VisualSupportsResponse extends BaseResponse {
  visualSupports: VisualSupportResource[];
}

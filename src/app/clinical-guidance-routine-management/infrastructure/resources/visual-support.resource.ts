/**
 * Resource representation of a visual support.
 */
export interface VisualSupportResource {
  id: number;
  activityId: number;
  fileUrl: string;
  fileFormat: string;
  createdAt?: string;
  uploadedAt?: string;
  status?: string;
}

/**
 * Response envelope for visual support collection queries.
 */
export interface VisualSupportsResponse {
  visualSupports: VisualSupportResource[];
}

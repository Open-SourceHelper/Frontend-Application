import {HttpClient} from '@angular/common/http';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {VisualSupport} from '../domain/model/visual-support.entity';
import {VisualSupportResource, VisualSupportsResponse} from './visual-supports-response';
import {VisualSupportAssembler} from './visual-support-assembler';
import {environment} from '../../../environments/environment';

/**
 * Endpoint client for visual support CRUD operations.
 */
export class VisualSupportsApiEndpoint extends BaseApiEndpoint<VisualSupport, VisualSupportResource, VisualSupportsResponse, VisualSupportAssembler> {
  /**
   * Creates an instance of VisualSupportsApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderVisualSupportsEndpointPath}`, new VisualSupportAssembler());
  }
}

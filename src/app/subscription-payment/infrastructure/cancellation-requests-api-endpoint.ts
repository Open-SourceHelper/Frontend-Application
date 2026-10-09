import {HttpClient} from '@angular/common/http';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {CancellationRequest} from '../domain/model/cancellation-request.entity';
import {CancellationRequestResource, CancellationRequestsResponse} from './cancellation-requests-response';
import {CancellationRequestAssembler} from './cancellation-request-assembler';
import {environment} from '../../../environments/environment';

/**
 * Endpoint client for cancellation request CRUD operations.
 */
export class CancellationRequestsApiEndpoint extends BaseApiEndpoint<CancellationRequest, CancellationRequestResource, CancellationRequestsResponse, CancellationRequestAssembler> {
  /**
   * Creates an instance of CancellationRequestsApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderCancellationRequestsEndpointPath}`, new CancellationRequestAssembler());
  }
}

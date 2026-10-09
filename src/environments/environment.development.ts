export const environment = {
  production: false,
  // Fake backend (json-server) until the Spring Boot RESTful API is implemented
  platformProviderApiBaseUrl: 'http://localhost:3000',

  //Aquí se ponen los demas providers
  // BC08 - Subscription & Payment Management
  platformProviderSubscriptionPlansEndpointPath: '/subscription-plans',
  platformProviderSubscriptionsEndpointPath: '/subscriptions',
  platformProviderPaymentsEndpointPath: '/payments',
  platformProviderCancellationRequestsEndpointPath: '/cancellation-requests',

  platformProviderSignInEndpointPath: '/authentication/sign-in',
  platformProviderSignUpEndpointPath: '/authentication/sign-up',
  logoProviderApiBaseUrl: 'https://img.logo.dev.com/',
};

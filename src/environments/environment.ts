export const environment = {
  production: true,
  // Fake backend (json-server) until the Spring Boot RESTful API is implemented
  platformProviderApiBaseUrl: 'http://localhost:3000',

  // BC02 - Child Profile Management
  platformProviderChildEndpointPath: '/children',
  platformProviderClinicalProfileEndpointPath: '/clinicalProfiles',
  platformProviderCaregiverAuthorizationEndpointPath: '/caregiver-authorization',

  // BC04 - Routine & Activity Management
  platformProviderRoutinesEndpointPath: '/routines',
  platformProviderRoutineActivitiesEndpointPath: '/routine-activities',
  platformProviderVisualSupportsEndpointPath: '/visual-supports',

  // BC08 - Subscription & Payment Management
  platformProviderSubscriptionPlansEndpointPath: '/subscription-plans',
  platformProviderSubscriptionsEndpointPath: '/subscriptions',
  platformProviderPaymentsEndpointPath: '/payments',
  platformProviderCancellationRequestsEndpointPath: '/cancellation-requests',

  platformProviderSignInEndpointPath: '/authentication/sign-in',
  platformProviderSignUpEndpointPath: '/authentication/sign-up',
  logoProviderApiBaseUrl: 'https://img.logo.dev.com/',
};

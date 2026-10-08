export const environment = {
  production: false,
  // Fake backend (json-server) until the Spring Boot RESTful API is implemented
  platformProviderApiBaseUrl: 'http://localhost:3000',

  // BC04 - Routine & Activity Management
  platformProviderRoutinesEndpointPath: '/routines',
  platformProviderRoutineActivitiesEndpointPath: '/routine-activities',
  platformProviderVisualSupportsEndpointPath: '/visual-supports',

  platformProviderSignInEndpointPath: '/authentication/sign-in',
  platformProviderSignUpEndpointPath: '/authentication/sign-up',
  logoProviderApiBaseUrl: 'https://img.logo.dev.com/',
};

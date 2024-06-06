import { initGraphQLTada } from 'gql.tada';

import type { introspection } from '~/contentstack-graphql';

export const contentstackGraphQL = initGraphQLTada<{
  introspection: introspection;
  disableMasking: true;
}>();

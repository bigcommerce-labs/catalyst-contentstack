import { cacheExchange, Client, fetchExchange } from '@urql/core';
import { initGraphQLTada } from 'gql.tada';

import type { introspection } from '~/contentstack-graphql';

export const contentstackGraphQL = initGraphQLTada<{
  introspection: introspection;
  disableMasking: true;
}>();

const getContentstackApiKey = () => {
  const contentstackApiKey = process.env.CONTENTSTACK_API_KEY;

  if (!contentstackApiKey) {
    throw new Error('CONTENTSTACK_API_KEY environment variable is required');
  }

  return contentstackApiKey;
};

const getContentstackEnvironment = () => {
  const contentstackEnvironment = process.env.CONTENTSTACK_ENVIRONMENT;

  if (!contentstackEnvironment) {
    throw new Error('CONTENTSTACK_ENVIRONMENT environment variable is required');
  }

  return contentstackEnvironment;
};

const getContentstackGraphqlEndpoint = () => {
  const contentstackApiKey = getContentstackApiKey();
  const contentstackEnvironment = getContentstackEnvironment();

  return `https://graphql.contentstack.com/stacks/${contentstackApiKey}?environment=${contentstackEnvironment}`;
};

const getContentstackDeliveryToken = () => {
  const contentstackDeliveryToken = process.env.CONTENTSTACK_DELIVERY_TOKEN;

  if (!contentstackDeliveryToken) {
    throw new Error('CONTENTSTACK_DELIVERY_TOKEN environment variable is required');
  }

  return contentstackDeliveryToken;
};

export const contentstackClient = new Client({
  url: getContentstackGraphqlEndpoint(),
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => ({
    headers: {
      access_token: getContentstackDeliveryToken(),
    },
  }),
});

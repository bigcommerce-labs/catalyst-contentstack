// @ts-check
const { generateSchema, generateOutput } = require('@gql.tada/cli-utils');
const { join } = require('path');

const getBigcommerceGraphqlApiDomain = () => {
  return process.env.BIGCOMMERCE_GRAPHQL_API_DOMAIN ?? 'mybigcommerce.com';
};

const getBigcommerceStoreHash = () => {
  const bigcommerceStoreHash = process.env.BIGCOMMERCE_STORE_HASH;

  if (!bigcommerceStoreHash) {
    throw new Error('BIGCOMMERCE_STORE_HASH environment variable is required');
  }

  return bigcommerceStoreHash;
};

const getBigcommerceChannelId = () => {
  return process.env.BIGCOMMERCE_CHANNEL_ID;
};

const getBigcommerceCustomerImpersonationToken = () => {
  const bigcommerceCustomerImpersonationToken =
    process.env.BIGCOMMERCE_CUSTOMER_IMPERSONATION_TOKEN;

  if (!bigcommerceCustomerImpersonationToken) {
    throw new Error('BIGCOMMERCE_CUSTOMER_IMPERSONATION_TOKEN environment variable is required');
  }

  return bigcommerceCustomerImpersonationToken;
};

const getContentstackApiKey = () => {
  const contentstackApiKey = process.env.CONTENTSTACK_API_KEY;

  if (!contentstackApiKey) {
    throw new Error('CONTENTSTACK_API_KEY environment variable is required');
  }

  return contentstackApiKey;
};

const getContentstackDeliveryToken = () => {
  const contentstackDeliveryToken = process.env.CONTENTSTACK_DELIVERY_TOKEN;

  if (!contentstackDeliveryToken) {
    throw new Error('CONTENTSTACK_DELIVERY_TOKEN environment variable is required');
  }

  return contentstackDeliveryToken;
};

const getContentstackEnvironment = () => {
  const contentstackEnvironment = process.env.CONTENTSTACK_ENVIRONMENT;

  if (!contentstackEnvironment) {
    throw new Error('CONTENTSTACK_ENVIRONMENT environment variable is required');
  }

  return contentstackEnvironment;
};

const getBigcommerceGraphqlEndpoint = () => {
  const bigcommerceGraphqlApiDomain = getBigcommerceGraphqlApiDomain();
  const bigcommerceStoreHash = getBigcommerceStoreHash();
  const bigcommerceChannelId = getBigcommerceChannelId();

  // Not all sites have the channel-specific canonical URL backfilled.
  // Wait till MSF-2643 is resolved before removing and simplifying the endpoint logic.
  if (!bigcommerceChannelId || bigcommerceChannelId === '1') {
    return `https://store-${bigcommerceStoreHash}.${bigcommerceGraphqlApiDomain}/graphql`;
  }

  return `https://store-${bigcommerceStoreHash}-${bigcommerceChannelId}.${bigcommerceGraphqlApiDomain}/graphql`;
};

const getContentstackGraphqlEndpoint = () => {
  const contentstackApiKey = getContentstackApiKey();
  const contentstackEnvironment = getContentstackEnvironment();

  return `https://graphql.contentstack.com/stacks/${contentstackApiKey}?environment=${contentstackEnvironment}`;
};

const generate = async () => {
  const bigcommerceGraphqlEndpoint = getBigcommerceGraphqlEndpoint();
  const contentstackGraphqlEndpoint = getContentstackGraphqlEndpoint();
  const bigcommerceCustomerImpersonationToken = getBigcommerceCustomerImpersonationToken();
  const contentstackDeliveryToken = getContentstackDeliveryToken();

  await generateSchema({
    input: bigcommerceGraphqlEndpoint,
    headers: { Authorization: `Bearer ${bigcommerceCustomerImpersonationToken}` },
    output: join(__dirname, '../bigcommerce.graphql'),
    tsconfig: undefined,
  });

  await generateSchema({
    input: contentstackGraphqlEndpoint,
    headers: { access_token: contentstackDeliveryToken },
    output: join(__dirname, '../contentstack.graphql'),
    tsconfig: undefined,
  });

  await generateOutput({
    disablePreprocessing: false,
    output: undefined,
    tsconfig: undefined,
  });
};

generate().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error.message);
  process.exit(1);
});

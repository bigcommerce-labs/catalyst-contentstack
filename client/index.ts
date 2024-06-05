import { createClient } from '@bigcommerce/catalyst-client';

import { backendUserAgent } from '../userAgent';

export const client = createClient({
  customerImpersonationToken: process.env.BIGCOMMERCE_CUSTOMER_IMPERSONATION_TOKEN ?? '',
  xAuthToken: process.env.BIGCOMMERCE_ACCESS_TOKEN ?? '',
  storeHash: process.env.BIGCOMMERCE_STORE_HASH ?? '',
  channelId: process.env.BIGCOMMERCE_CHANNEL_ID,
  backendUserAgentExtensions: backendUserAgent,
  logger:
    (process.env.NODE_ENV !== 'production' && process.env.CLIENT_LOGGER !== 'false') ||
    process.env.CLIENT_LOGGER === 'true',
});

export const spanishClient = createClient({
  customerImpersonationToken: process.env.SPANISH_BIGCOMMERCE_CUSTOMER_IMPERSONATION_TOKEN ?? '',
  xAuthToken: process.env.SPANISH_BIGCOMMERCE_ACCESS_TOKEN ?? '',
  storeHash: process.env.SPANISH_BIGCOMMERCE_STORE_HASH ?? '',
  channelId: process.env.SPANISH_BIGCOMMERCE_CHANNEL_ID,
  backendUserAgentExtensions: backendUserAgent,
  logger:
    (process.env.NODE_ENV !== 'production' && process.env.CLIENT_LOGGER !== 'false') ||
    process.env.CLIENT_LOGGER === 'true',
});

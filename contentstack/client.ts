/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-assertions */

import { DefinitionNode, DocumentNode, Kind, OperationDefinitionNode, parse, print } from 'graphql';

function isOperationDefinitionNode(node: DefinitionNode): node is OperationDefinitionNode {
  return node.kind === Kind.OPERATION_DEFINITION;
}

function getOperationInfo(document: string) {
  const documentNode = parse(document);

  const operationInfo = documentNode.definitions.filter(isOperationDefinitionNode).map((def) => {
    return {
      name: def.name?.value,
      type: def.operation,
    };
  })[0];

  return operationInfo;
}

interface DocumentDecoration<Result = Record<string, any>, Variables = Record<string, any>> {
  __apiType?: (variables: Variables) => Result;
  __ensureTypesOfVariablesAndResultMatching?: (variables: Variables) => Result;
}

interface GraphQLResponse<T> {
  data: T;
}

function normalizeQuery(query: string | DocumentNode | DocumentDecoration<any, any>) {
  if (typeof query === 'string') {
    return query;
  }

  if (query instanceof String) {
    return query.toString();
  }

  if ('kind' in query) {
    return print(query);
  }

  throw new Error('Invalid query type');
}

function getContentstackApiKey() {
  const contentstackApiKey = process.env.CONTENTSTACK_API_KEY;

  if (!contentstackApiKey) {
    throw new Error('CONTENTSTACK_API_KEY environment variable is required');
  }

  return contentstackApiKey;
}

function getContentstackEnvironment() {
  const contentstackEnvironment = process.env.CONTENTSTACK_ENVIRONMENT;

  if (!contentstackEnvironment) {
    throw new Error('CONTENTSTACK_ENVIRONMENT environment variable is required');
  }

  return contentstackEnvironment;
}

function getContentstackGraphqlEndpoint() {
  const contentstackApiKey = getContentstackApiKey();
  const contentstackEnvironment = getContentstackEnvironment();

  return `https://graphql.contentstack.com/stacks/${contentstackApiKey}?environment=${contentstackEnvironment}`;
}

function getContentstackDeliveryToken() {
  const contentstackDeliveryToken = process.env.CONTENTSTACK_DELIVERY_TOKEN;

  if (!contentstackDeliveryToken) {
    throw new Error('CONTENTSTACK_DELIVERY_TOKEN environment variable is required');
  }

  return contentstackDeliveryToken;
}

function requestLogger(document: string) {
  if (
    !(
      (process.env.NODE_ENV !== 'production' && process.env.CLIENT_LOGGER !== 'false') ||
      process.env.CLIENT_LOGGER === 'true'
    )
  ) {
    return () => {
      // noop
    };
  }

  // @ts-expect-error - testing logging
  const { name, type } = getOperationInfo(document);

  const timeStart = Date.now();

  return (response: Response) => {
    const timeEnd = Date.now();
    const duration = timeEnd - timeStart;

    const complexity = response.headers.get('x-query-complexity');

    // eslint-disable-next-line no-console
    console.log(
      `[Contentstack] ${type} ${name ?? 'anonymous'} - ${duration}ms - complexity ${complexity ?? 'unknown'}`,
    );
  };
}

// Overload for documents that require variables
export async function contentstackFetch<
  TResult,
  TVariables extends Record<string, unknown>,
>(config: {
  document: DocumentDecoration<TResult, TVariables>;
  variables: TVariables;
  fetchOptions?: RequestInit;
}): Promise<GraphQLResponse<TResult>>;

// Overload for documents that do not require variables
export async function contentstackFetch<TResult>(config: {
  document: DocumentDecoration<TResult, Record<string, never>>;
  variables?: undefined;
  fetchOptions?: RequestInit;
}): Promise<GraphQLResponse<TResult>>;

export async function contentstackFetch<TResult, TVariables>({
  document,
  variables,
  fetchOptions = {} as RequestInit,
}: {
  document: DocumentDecoration<TResult, TVariables>;
  variables?: TVariables;
  fetchOptions?: RequestInit;
}): Promise<GraphQLResponse<TResult>> {
  const { cache, headers = {}, ...rest } = fetchOptions;
  const query = normalizeQuery(document);
  const log = requestLogger(query);

  const response = await fetch(getContentstackGraphqlEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      access_token: getContentstackDeliveryToken(),
      ...headers,
    },
    body: JSON.stringify({
      query,
      ...(variables && { variables }),
    }),
    ...(cache && { cache }),
    ...rest,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  log(response);

  return response.json() as Promise<GraphQLResponse<TResult>>;
}

import { jsonToHtml } from '@contentstack/json-rte-serializer';
import { cache } from 'react';

import { ResultOf } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';

import { contentstackFetch } from './client';
import { contentstackGraphQL } from './graphql';

const PostsFragment = contentstackGraphQL(`
  fragment PostsFragment on Posts {
    author
    content {
      json
    }
    meta_description
    meta_keywords
    post_tagsConnection {
      edges {
        node {
          ... on PostTags {
            title
          }
        }
      }
    }
    slug
    system {
      uid
      locale
      created_at
    }
    title
    thumbnailConnection {
      edges {
        node {
          content_type
          description
          dimension {
            height
            width
          }
          title
          unique_identifier
          url
        }
      }
    }
  }
`);

const BlogPostsQuery = contentstackGraphQL(
  `
    query postsQuery($locale: String, $limit: Int, $skip: Int) {
      all_posts(locale: $locale, order_by: created_at_DESC, limit: $limit, skip: $skip) {
        items {
          ...PostsFragment
        }
        total
      }
    }
    
    `,
  [PostsFragment],
);

const SingleBlogPostQuery = contentstackGraphQL(
  `
    query postsQuery($locale: String, $slug: String = "") {
      all_posts(locale: $locale, order_by: created_at_DESC, where: {slug: $slug}) {
        items {
          ...PostsFragment
        }
        total
      }
    }
    
    `,
  [PostsFragment],
);

interface BlogPostsFiltersInput {
  tagId?: string;
}

interface Pagination {
  limit?: number;
  before?: number;
  after?: number;
}

export const getBlogPosts = cache(
  async (
    { tagId, limit = 9, before, after = 0 }: BlogPostsFiltersInput & Pagination,
    locale: string,
  ) => {
    const skip = before ? before - limit : after;

    const filterArgs = tagId ? { filters: { tags: [tagId] } } : {};

    const mappedLocale = locale === 'en' ? 'en-us' : locale;

    const { data } = await contentstackFetch({
      document: BlogPostsQuery,
      variables: {
        ...filterArgs,
        locale: mappedLocale,
        limit: 9,
        skip,
      },
      fetchOptions: { next: { revalidate } },
    });

    const blog = transformDataToBlogPosts({
      apiResponse: data,
      tagId,
      skip,
    });

    return {
      ...blog,
      posts: {
        pageInfo: blog.posts.pageInfo,
        items: blog.posts.items,
      },
    };
  },
);

interface SingleBlogPostFiltersInput {
  entityId: string;
}

export const getBlogPageData = cache(
  async ({ entityId }: SingleBlogPostFiltersInput, locale?: string) => {
    const mappedLocale = !locale || locale === 'en' ? 'en-us' : locale;

    const { data } = await contentstackFetch({
      document: SingleBlogPostQuery,
      variables: {
        locale: mappedLocale,
        slug: entityId,
      },
      fetchOptions: { next: { revalidate } },
    });

    const blog = transformDataToBlogPosts({
      apiResponse: data,
    });

    return {
      post: blog.posts.items?.[0],
    };
  },
);

interface BlogPostsTransformProps {
  apiResponse: ResultOf<typeof BlogPostsQuery>;
  tagId?: string;
  skip?: number;
  limit?: number;
}

// These functions are here primarily here to emulate the BigCommerce responses powering the BlogPost pages by default,
// so this can drop directly into an existing Catalyst page.
//
// e.g.  isVisibleInNavigation value is used in those pages and will render a 404 if it's set to false.
//
// That said, the functions do simplify the response used within the page and provide a central place to alter logic.

function transformDataToBlogPosts({
  apiResponse,
  tagId,
  skip = 0,
  limit = 9,
}: BlogPostsTransformProps) {
  const totalNumPosts = apiResponse.all_posts?.total || 0;

  return {
    name: `Blog${tagId ? `: ${tagId}` : ''}`,
    posts: {
      pageInfo: {
        hasNextPage: totalNumPosts - (skip + limit) > 0,
        hasPreviousPage: skip - limit >= 0,
        startCursor: skip,
        endCursor: skip + limit,
      },
      items: apiResponse.all_posts?.items?.map((post) => {
        return {
          author: post?.author,
          entityId: post?.slug!,
          name: post?.title!,
          plainTextSummary: getItemSummary(post?.content?.json),
          publishedDate: { utc: post?.system?.created_at as string },
          thumbnailImage: post?.thumbnailConnection?.edges?.[0]?.node
            ? {
                altText: post.thumbnailConnection.edges[0]?.node?.description || '',
                url: post.thumbnailConnection.edges[0]?.node.url || '',
              }
            : null,
          htmlBody: jsonToHtml(post?.content?.json, {
            customElementTypes: {
              h1: (attrs, child, jsonBlock) => {
                return `<h1 className="lg:text-md text-sm">${child}</h1>`;
              },
              h2: (attrs, child, jsonBlock) => {
                return `<h2 className="text-3xl lg:text-4xl">${child}</h2>`;
              },
              h3: (attrs, child, jsonBlock) => {
                return `<h3 className="text-2xl lg:text-3xl">${child}</h3>`;
              },
              h4: (attrs, child, jsonBlock) => {
                return `<h4 className="text-xl lg:text-2xl">${child}</h4>`;
              },
              h5: (attrs, child, jsonBlock) => {
                return `<h5 class="text-xl font-bold lg:text-2xl">${child}</h5>`;
              },
              h6: (attrs, child, jsonBlock) => {
                return `<h6 className="text-md lg:text-lg">${child}</h6>`;
              },
              // 'a': (attrs, child, jsonBlock) => {
              //   return `<Link {...attrs}>{child}</Link>`
              // },
              code: (attrs, child, jsonBlock) => {
                return `<code className="bg-black p-4 text-sm text-white">${child}</code>`;
              },
            },
          }),
        };
      }),
    },
    isVisibleInNavigation: true,
  };
}

//         link: ({ children, url }) => <Link href={url}>{children}</Link>,
//         list: ({ children, format }) =>
//           format === 'ordered' ? (
//             <ol className="relative left-4 list-decimal">{children}</ol>
//           ) : (
//             <ul className="relative left-4 list-disc">{children}</ul>
//           ),
//         quote: ({ children }) => (
//           <blockquote className="border-color-black border-l-2 p-2 pl-4 italic">
//             {children}
//           </blockquote>
//         ),

interface ChildNode {
  text?: string;
  children?: ChildNode[];
  uid: string;
  type: string;
  attrs: Record<string, any>;
}

interface ContentJSON {
  uid: string;
  type: string;
  attrs: Record<string, any>;
  children: ChildNode[];
}

function getItemSummary(contentJson: ContentJSON | unknown, summaryLength = 145): string {
  function extractText(children: ChildNode[]): string[] {
    let texts: string[] = [];

    children.forEach((child) => {
      if (child.text) {
        texts.push(child.text);
      }

      if (child.children) {
        texts = texts.concat(extractText(child.children));
      }
    });

    return texts;
  }

  const textValues = extractText(contentJson.children);

  const summary = textValues.join(' ');

  return `${summary.slice(0, 145)}${summary.length > summaryLength ? '...' : ''}`;
}

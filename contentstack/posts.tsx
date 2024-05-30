import { Link } from '~/components/link';

import { contentstackClient, contentstackGraphQL } from './client';

export async function ContentstackPosts({ locale }: { locale: string }) {
  const mappedLocale = locale === 'en' ? 'en-us' : locale;

  const POSTS_QUERY = contentstackGraphQL(`
    query postsQuery($locale: String!) {
      all_posts(
        locale: $locale,
        order_by: created_at_ASC
      ) {
        items {
          title
        }
      }
    }
  `);

  const { data } = await contentstackClient.query(POSTS_QUERY, { locale: mappedLocale });

  if (!data) {
    return (
      <section>
        <p>Posts not found</p>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="flex gap-1">
        <h2 className="font-bold">Contentstack Posts</h2>
        <span>
          (
          {mappedLocale === 'en-us' ? (
            <Link className="text-primary" href="/es" scroll={false}>
              view Spanish
            </Link>
          ) : (
            <Link className="text-primary" href="/en" scroll={false}>
              view English
            </Link>
          )}
          )
        </span>
      </div>
      <ul>
        {data.all_posts?.items?.map((post) => {
          return <li key={post?.title}>{post?.title}</li>;
        })}
      </ul>
    </section>
  );
}

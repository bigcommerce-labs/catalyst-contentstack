import { contentstackClient, contentstackGraphQL } from './client';

export async function ContentstackPosts() {
  const POSTS_QUERY = contentstackGraphQL(`
    query postsQuery {
      all_posts(
        locale: "en-us"
      ) {
        items {
          title
        }
      }
    }
  `);

  const { data } = await contentstackClient.query(POSTS_QUERY, {});

  if (!data) {
    return (
      <section>
        <p>Posts not found</p>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <h2>Contentstack Posts</h2>
      <ul>
        {data.all_posts?.items?.map((post) => {
          return <li key={post?.title}>{post?.title}</li>;
        })}
      </ul>
    </section>
  );
}

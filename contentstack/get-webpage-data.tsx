import { cache } from 'react';

import { contentstackClient, contentstackGraphQL } from './client';

export const ContentstackWebpageHeroBannerFragment = contentstackGraphQL(`
  fragment WebpagesPageComponentsHeroBanner on WebpagesPageComponentsHeroBanner {
    __typename
    hero_banner {
      hero_bannerConnection {
        edges {
          node {
            ... on HeroBanner {
              title
              background_color
              banner_description
              banner_imageConnection {
                edges {
                  node {
                    content_type
                    description
                    dimension {
                      height
                      width
                    }
                    url
                    title
                    unique_identifier
                  }
                }
              }
              call_to_action {
                href
                title
              }
              banner_image_alignment
              content_title_alignment
              is_banner_image_full_width_
              text_color
            }
          }
        }
      }
    }
  }
`);

export const ContentstackWebpageSectionsFragment = contentstackGraphQL(`
  fragment WebpagesPageComponentsSections on WebpagesPageComponentsSections {
    __typename
    sections {
      call_to_action {
        href
        title
      }
      description
      imageConnection {
        edges {
          node {
            unique_identifier
            url
            title
            content_type
            description
            dimension {
              height
              width
            }
          }
        }
      }
      is_image_right_aligned
      title_h2
    }
  }
`);

export const ContentstackWebpageSectionWithBucketFragment = contentstackGraphQL(`
  fragment WebpagesPageComponentsSectionWithBucket on WebpagesPageComponentsSectionWithBucket {
    __typename
    section_with_bucket {
      buckets {
        call_to_action {
          href
          title
        }
        description
        iconConnection {
          edges {
            node {
              content_type
              description
              dimension {
                height
                width
              }
              title
              url
              unique_identifier
            }
          }
        }
        imageConnection {
          edges {
            node {
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
        image_alignment
        title_h3
      }
      description
      tabular_buckets
      title_h2
    }
  }
`);

export const ContentstackWebpageSectionWithCardsFragment = contentstackGraphQL(`
  fragment WebpagesPageComponentsSectionWithCards on WebpagesPageComponentsSectionWithCards {
    __typename
    section_with_cards {
      cards {
        call_to_action {
            href
            title
        }
        card_title_h3
        description
        imageConnection {
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
      section_description
      section_title
    }
  }
`);

export const ContentstackWebpageSectionWithHtmlCodeFragment = contentstackGraphQL(`
  fragment WebpagesPageComponentsSectionWithHtmlCode on WebpagesPageComponentsSectionWithHtmlCode {
    __typename
    section_with_html_code {
      description
      html_code
      is_html_code_left_aligned_
      title
    }
  }
`);

export const ContentstackWebpageAwardsAchievementsFragment = contentstackGraphQL(`
  fragment WebpagesPageComponentsAwardsAchievements on WebpagesPageComponentsAwardsAchievements {
    __typename
    awards_achievements {
      awards_achievements {
        description
        imageConnection {
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
        title
        link {
          href
          title
        }
      }
    }
  }
`);

export const ContentstackWebpageTeamFragment = contentstackGraphQL(`
  fragment WebpagesPageComponentsTeam on WebpagesPageComponentsTeam {
    __typename
    team {
      teamConnection {
        edges {
          node {
            ... on OurTeam {
              title
              description
              employees {
                designation
                name
                short_description
                imageConnection {
                  edges {
                    node {
                      content_type
                      title
                      unique_identifier
                      url 
                      description
                      dimension {
                        height
                        width
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`);

export const ContentstackWebpageContactUsFragment = contentstackGraphQL(`
  fragment WebpagesPageComponentsContactUs on WebpagesPageComponentsContactUs {
    __typename
    contact_us {
      referenceConnection {
        edges {
          node {
            ... on Contact {
              title
              address
              contact_number
              email_address
            }
          }
        }
      }
    }
  }
`);

export const ContentstackWebpageProductsCarouselFragment = contentstackGraphQL(`
  fragment WebpagesPageComponentsProductsCarousel on WebpagesPageComponentsProductsCarousel {
    __typename
    products_carousel {
      title
      type
    }
  }
`);

export const ContentstackWebpageComponentsFragment = contentstackGraphQL(
  `
  fragment WebpagesPageComponents on Webpages {
    page_components {
      ...WebpagesPageComponentsHeroBanner
      ...WebpagesPageComponentsSections
      ...WebpagesPageComponentsSectionWithBucket
      ...WebpagesPageComponentsSectionWithCards
      ...WebpagesPageComponentsSectionWithHtmlCode
      ...WebpagesPageComponentsAwardsAchievements
      ...WebpagesPageComponentsTeam
      ...WebpagesPageComponentsContactUs
      ...WebpagesPageComponentsProductsCarousel
    }
  }
`,
  [
    ContentstackWebpageHeroBannerFragment,
    ContentstackWebpageSectionsFragment,
    ContentstackWebpageSectionWithBucketFragment,
    ContentstackWebpageSectionWithCardsFragment,
    ContentstackWebpageSectionWithHtmlCodeFragment,
    ContentstackWebpageAwardsAchievementsFragment,
    ContentstackWebpageTeamFragment,
    ContentstackWebpageContactUsFragment,
    ContentstackWebpageProductsCarouselFragment,
  ],
);

export const WEBPAGES_QUERY = contentstackGraphQL(
  `
  query webpagesQuery($locale: String!, $url: String!) {
    all_webpages(where: { url: $url }, locale: $locale) {
      items {
        ...WebpagesPageComponents
        seo {
          meta_title
          meta_description
          keywords
          enable_search_indexing
        }
        url
        title
        system {
          uid
          locale
          content_type_uid
        }
      }
    }
  }
`,
  [ContentstackWebpageComponentsFragment],
);

export const getWebpageData = cache(async (variables: { id?: string; locale: string }) => {
  const mappedLocale = variables.locale === 'en' ? 'en-us' : variables.locale;

  const { data } = await contentstackClient.query(WEBPAGES_QUERY, {
    locale: mappedLocale,
    url: `/${variables.id ?? ''}`,
  });

  if (!data) {
    return null;
  }

  return data.all_webpages?.items?.[0];
});

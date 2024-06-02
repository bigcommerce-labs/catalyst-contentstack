/* eslint-disable */
import React from 'react';

import AboutSectionBucket from './about-section-bucket';
import CardSection from './card-section';
import HeroBanner from './hero-banner';
import Section from './section';
import SectionBucket from './section-bucket';
import SectionWithHtmlCode from './section-with-html-code';
import TeamSection from './team-section';

// import { ContentstackWebpageComponentsFragment } from '../[id]/page';

// import { FragmentOf } from '~/client/graphql';

// type FragmentResult = FragmentOf<typeof ContentstackWebpageComponentsFragment>;
// type PageComponents = FragmentResult['page_components'];

interface RenderProps {
  contentTypeUid?: string | null;
  entryUid?: string | null;
  locale: string;
  pageComponents: any[];
  // pageComponents: PageComponents <-- todo: should work but doesn't
}

export default function RenderComponents(props: RenderProps) {
  const { pageComponents, entryUid, contentTypeUid, locale } = props;

  return (
    <div data-contenttype={contentTypeUid} data-locale={locale} data-pageref={entryUid}>
      {pageComponents.map((component, key) => {
        if (component.hero_banner) {
          return (
            <HeroBanner
              banner={component?.hero_banner.hero_bannerConnection.edges[0].node}
              key={`component-${key}`}
            />
          );
        }
        if (component.section) {
          return <Section section={component.section} key={`component-${key}`} />;
        }
        if (component.section_with_bucket) {
          return component.section_with_bucket.bucket_tabular ? (
            <AboutSectionBucket
              sectionWithBuckets={component.section_with_bucket}
              key={`component-${key}`}
            />
          ) : (
            <SectionBucket section={component.section_with_bucket} key={`component-${key}`} />
          );
        }
        if (component.section_with_cards) {
          return (
            <CardSection cards={component.section_with_cards.cards} key={`component-${key}`} />
          );
        }
        if (component.section_with_html_code) {
          return (
            <SectionWithHtmlCode
              embedCode={component.section_with_html_code}
              key={`component-${key}`}
            />
          );
        }
        if (component.our_team) {
          return <TeamSection ourTeam={component.our_team} key={`component-${key}`} />;
        }
      })}

      {/* For debugging page component response (remove later) */}
      {/* <textarea>{JSON.stringify(pageComponents)}</textarea> */}
    </div>
  );
}

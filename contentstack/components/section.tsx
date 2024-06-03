import React from 'react';

import { Link } from '~/components/link';
import { CallToAction, ImageConnection } from '~/contentstack/types';
import { ContentstackImageComponent } from '~/contentstack/utils';

interface SectionProps {
  title_h2?: string;
  description?: string;
  call_to_action?: CallToAction;
  imageConnection?: ImageConnection;
  image_alignment?: string;
}

export default function Section({ section }: { section: SectionProps }) {
  function contentSection(key: string) {
    return (
      <div className="home-content" key={key}>
        <h2>{section.title_h2}</h2>
        <p>{section.description}</p>
        {section.call_to_action?.title && section.call_to_action.href ? (
          <Link className="btn secondary-btn" href={section.call_to_action.href}>
            {section.call_to_action.title}
          </Link>
        ) : (
          ''
        )}
      </div>
    );
  }

  function imageContent(key: string) {
    return <ContentstackImageComponent imageConnection={section.imageConnection} key={key} />;
  }

  return (
    <div className="home-advisor-section">
      {section.image_alignment === 'Left'
        ? [imageContent('key-image'), contentSection('key-contentstection')]
        : [contentSection('key-contentstection'), imageContent('key-image')]}
    </div>
  );
}

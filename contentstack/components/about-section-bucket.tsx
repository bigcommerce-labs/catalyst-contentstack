import React from 'react';

import { CallToAction, ImageConnection } from '~/contentstack/types';
import { ContentstackImageComponent } from '~/contentstack/utils';

interface Bucket {
  title_h3: string;
  description: string;
  iconConnection: ImageConnection;
  url: string;
}

interface BucketsList {
  title_h3: string;
  description: string;
  url: string;
  call_to_action: CallToAction;
  iconConnection: ImageConnection;
}

interface BucketProps {
  title_h2: string;
  buckets: [BucketsList];
}

export default function AboutSectionBucket({
  sectionWithBuckets,
}: {
  sectionWithBuckets: BucketProps;
}) {
  function bucketContent(bucket: Bucket, index: number) {
    return (
      <div className="mission-content-section" key={index}>
        <ContentstackImageComponent
          className="mission-icon"
          imageConnection={bucket.iconConnection}
        />

        <div className="mission-section-content">
          {bucket.title_h3 ? <h3>{bucket.title_h3}</h3> : ''}
          {typeof bucket.description === 'string' && (
            <div dangerouslySetInnerHTML={{ __html: bucket.description }} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="member-main-section">
      <div className="member-head">
        {sectionWithBuckets.title_h2 ? <h2>{sectionWithBuckets.title_h2}</h2> : ''}
      </div>
      <div className="mission-section">
        <div className="mission-content-top">
          {sectionWithBuckets.buckets.map(
            (bucket, index) => index < 2 && bucketContent(bucket, index),
          )}
        </div>
        <div className="mission-content-bottom">
          {sectionWithBuckets.buckets.map(
            (bucket, index) => index >= 2 && bucketContent(bucket, index),
          )}
        </div>
      </div>
    </div>
  );
}

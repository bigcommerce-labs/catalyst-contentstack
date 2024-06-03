import React from 'react';

import { Link } from '~/components/link';
import { Button } from '~/components/ui/button';
import { CallToAction, ImageConnection } from '~/contentstack/types';
import { ContentstackImageComponent } from '~/contentstack/utils';

interface Buckets {
  title_h3: string;
  description: string;
  call_to_action: CallToAction;
  iconConnection?: ImageConnection;
}

export interface BucketProps {
  title_h2: string;
  description: string;
  buckets: [Buckets];
}

export default function SectionBucket({ section }: { section: BucketProps }) {
  return (
    <div className="m-auto p-16 leading-5">
      <div className="text-center">
        {section.title_h2 ? (
          <h2 className="mb-2 mt-0 text-3xl font-black lg:text-4xl">{section.title_h2}</h2>
        ) : (
          ''
        )}
        {section.description ? <p className="mb-4">{section.description}</p> : ''}
      </div>
      <div className="flex items-center justify-center py-8">
        <div className="grid max-w-screen-lg grid-cols-1 gap-14 md:grid-cols-2 lg:grid-cols-2">
          {section.buckets.map((bucket, index) => (
            <div className="flex justify-center" key={index}>
              <div className="flex max-w-md items-start space-x-4">
                <div className="flex-shrink-0">
                  <ContentstackImageComponent
                    className="h-12 w-12"
                    imageConnection={bucket.iconConnection}
                  />
                </div>

                <div>
                  {bucket.title_h3 ? (
                    <h3 className="mb-2 text-xl font-bold">{bucket.title_h3}</h3>
                  ) : (
                    ''
                  )}
                  {typeof bucket.description === 'string' && (
                    <div
                      className="mb-2"
                      dangerouslySetInnerHTML={{ __html: bucket.description }}
                    />
                  )}
                  {bucket.call_to_action.title ? (
                    <Link
                      href={bucket.call_to_action.href ? bucket.call_to_action.href : '#'}
                      legacyBehavior
                    >
                      <Button variant="subtle">{`${bucket.call_to_action.title} -->`}</Button>
                    </Link>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

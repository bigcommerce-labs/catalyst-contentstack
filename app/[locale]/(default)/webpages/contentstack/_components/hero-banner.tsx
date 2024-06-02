import React from 'react';

import { Link } from '~/components/link';
import { CallToAction, Color, ImageConnection } from '~/contentstack/types';
import { ContentstackImageComponent } from '~/contentstack/utils';

interface Banner {
  background_color?: Color;
  text_color?: Color;
  title: string;
  banner_description: string;
  call_to_action?: CallToAction;
  banner_imageConnection?: ImageConnection;
}

interface BannerProps {
  banner: Banner;
}

export default function HeroBanner({ banner }: BannerProps) {
  return (
    <div
      className="flex flex-wrap justify-evenly p-[63px] text-center text-white"
      style={{
        background: banner.background_color?.hex ? banner.background_color.hex : '',
      }}
    >
      <div
        className="mt-[65px] w-[475px] text-left"
        style={{
          color: banner.text_color?.hex ? banner.text_color.hex : '#000',
        }}
      >
        {banner.title ? (
          <h1 className="mx-0 my-3 text-left text-5xl font-bold tracking-normal sm:text-3xl sm:leading-9 sm:tracking-normal md:text-3xl md:font-bold md:leading-8 md:tracking-normal xl:text-4xl">
            {banner.title}
          </h1>
        ) : (
          ''
        )}
        {banner.banner_description ? (
          <p
            className="mb-8 mt-0 text-left text-base leading-5 tracking-wide md:mb-10 md:text-sm md:leading-6 md:tracking-wide"
            style={{
              color: banner.text_color?.hex ? banner.text_color.hex : '#222',
            }}
          >
            {banner.banner_description}
          </p>
        ) : (
          ''
        )}
        {banner.call_to_action?.title && banner.call_to_action.href ? (
          <Link className="btn tertiary-btn" href={banner.call_to_action.href}>
            {banner.call_to_action.title}
          </Link>
        ) : (
          ''
        )}
      </div>
      <ContentstackImageComponent imageConnection={banner.banner_imageConnection} />
    </div>
  );
}

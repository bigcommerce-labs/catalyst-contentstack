import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { unstable_setRequestLocale } from 'next-intl/server';

import { getWebpageData } from '~/contentstack/get-webpage-data';
import { LocaleType } from '~/i18n';

import RenderComponents from '../../../contentstack/components/render-components';

interface Props {
  params: {
    locale: LocaleType;
  };
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const webpage = await getWebpageData({ locale });

  if (!webpage) {
    notFound();
  }

  return {
    title: webpage.seo?.meta_title,
    description: webpage.seo?.meta_description,
    keywords: webpage.seo?.keywords,
  };
}

export default async function Home({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);

  const webpage = await getWebpageData({ locale });

  if (!webpage) {
    notFound();
  }

  return (
    <RenderComponents
      contentTypeUid={webpage.system?.content_type_uid}
      entryUid={webpage.system?.uid}
      locale={webpage.system?.locale ?? 'en'}
      pageComponents={webpage.page_components ?? []}
    />
  );
}

export const runtime = 'edge';

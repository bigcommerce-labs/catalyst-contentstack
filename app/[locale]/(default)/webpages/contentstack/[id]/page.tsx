import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import RenderComponents from '~/contentstack/components/render-components';
import { getWebpageData } from '~/contentstack/get-webpage-data';
import { LocaleType } from '~/i18n';

interface Props {
  params: { id: string; locale: LocaleType };
}

export async function generateMetadata({ params: { id, locale } }: Props): Promise<Metadata> {
  const webpage = await getWebpageData({ id, locale });

  if (!webpage) {
    notFound();
  }

  return {
    title: webpage.seo?.meta_title,
    description: webpage.seo?.meta_description,
    keywords: webpage.seo?.keywords,
  };
}

export default async function WebPage({ params: { id, locale } }: Props) {
  const webpage = await getWebpageData({ id, locale });

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

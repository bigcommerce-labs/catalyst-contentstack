import { notFound } from 'next/navigation';
import { createLocalizedPathnamesNavigation } from 'next-intl/navigation';
import { getRequestConfig } from 'next-intl/server';

enum LocalePrefixes {
  ALWAYS = 'always',
  NEVER = 'never',
  ASNEEDED = 'as-needed', // removes prefix on default locale
}

const locales = [
  'da',
  'en',
  'es-419',
  'es-AR',
  'es-CL',
  'es-CO',
  'es-LA',
  'es-MX',
  'es-PE',
  'es',
  'it',
  'nl',
  'pl',
  'pt',
  'de',
  'fr',
  'ja',
  'no',
  'pt-BR',
  'sv',
] as const;

type LocalePrefixesType = `${LocalePrefixes}`;

// Temporary we use NEVER prefix to prioritize accept-language header
// & disable internationalized routes due to incomplete multilingual implementation
const localePrefix: LocalePrefixesType = LocalePrefixes.NEVER;
const defaultLocale = 'en';

type LocaleType = (typeof locales)[number];

export default getRequestConfig(async (params) => {
  let lang = params.locale as LocaleType; // eslint-disable-line

  if (!locales.includes(lang)) notFound();

  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    messages: await import(`./messages/${lang}`),
  };
});

export const { Link, getPathname, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({
    locales,
    pathnames: {},
    localePrefix,
  });

export { LocalePrefixes, locales, localePrefix, defaultLocale };
export type { LocaleType };

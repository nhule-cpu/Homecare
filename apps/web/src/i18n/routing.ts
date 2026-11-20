import { DEFAULT_LOCALE, LOCALES } from '@homecare/i18n';
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
});

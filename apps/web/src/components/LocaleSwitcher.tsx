'use client';

import { cx } from '@homecare/ui';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

/** Nút chuyển ngôn ngữ VI/EN. */
export function LocaleSwitcher() {
  const t = useTranslations('locale');
  const current = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      role="group"
      aria-label={t('switch')}
      className="flex shrink-0 overflow-hidden rounded-md border border-slate-300 dark:border-slate-700"
    >
      {routing.locales.map((locale) => (
        <button
          key={locale}
          type="button"
          lang={locale}
          title={t(locale)}
          aria-pressed={locale === current}
          onClick={() => router.replace(pathname, { locale })}
          className={cx(
            'px-3 py-1.5 text-sm font-medium uppercase',
            locale === current
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'hover:bg-slate-100 dark:hover:bg-slate-800',
          )}
        >
          {locale}
        </button>
      ))}
    </div>
  );
}

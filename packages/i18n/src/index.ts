import en from './en.json';
import vi from './vi.json';

export const LOCALES = ['vi', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'vi';

export type Messages = typeof vi;
export const messages: Record<Locale, Messages> = { vi, en };

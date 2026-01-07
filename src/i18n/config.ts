export const locales = ['pl', 'en'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'pl'

export function isLocale(value: string | undefined): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value)
}

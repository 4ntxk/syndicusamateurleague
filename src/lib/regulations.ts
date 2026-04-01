export function getRegulationsUrl(locale: string | undefined) {
  return locale === 'en' ? '/regulamin-sal010426en.pdf' : '/regulamin-sal010426.pdf'
}

'use client'

import { useParams } from 'next/navigation'
import { defaultLocale, isLocale, type Locale } from './config'

export function useLocale(): Locale {
  const params = useParams()
  const raw = params?.locale
  const value = Array.isArray(raw) ? raw[0] : raw

  return isLocale(value) ? value : defaultLocale
}

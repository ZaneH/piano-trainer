import i18n from 'i18next'
import enTranslation from './en/translation'
import frTranslation from './fr/translation'
import brTranslation from './br/translation'
import jaTranslation from './ja/translation'
import deTranslation from './de/translation'
import zhTranslation from './zh/translation'
import { initReactI18next } from 'react-i18next'
import { AVAILABLE_LANGUAGES } from '../utils/languages'

export const resources = {
  en: {
    translation: enTranslation,
  },
  zh: {
    translation: zhTranslation,
  },
  fr: {
    translation: frTranslation,
  },
  br: {
    translation: brTranslation,
  },
  ja: {
    translation: jaTranslation,
  },
  de: {
    translation: deTranslation,
  },
} as const

i18n.use(initReactI18next).init({
  lng: AVAILABLE_LANGUAGES.en.code,
  fallbackLng: AVAILABLE_LANGUAGES.en.code,
  resources,
})

import i18n from 'i18next'
import enTranslation from './en/translation'
import frTranslation from './fr/translation'
import { initReactI18next } from 'react-i18next'

export const resources = {
  en: {
    translation: enTranslation,
  },
  fr: {
    translation: frTranslation,
  },
} as const

i18n.use(initReactI18next).init({
  lng: 'en',
  resources,
})

export type SupportedLanguagesType = 'en' | 'fr'

export type LanguageOptionType = {
  name: string
  code: SupportedLanguagesType
}

export const AVAILABLE_LANGUAGES: {
  [key in SupportedLanguagesType]: LanguageOptionType
} = {
  en: {
    name: 'English',
    code: 'en',
  },
  fr: {
    name: 'Français',
    code: 'fr',
  },
} as const

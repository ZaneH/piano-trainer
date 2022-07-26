export type SupportedLanguagesType = 'en' | 'fr' | 'br'

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
  br: {
    name: 'Português',
    code: 'br',
  },
} as const

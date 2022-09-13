export type SupportedLanguagesType = 'en' | 'fr' | 'br' | 'ja' | 'de' | 'zh'

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
  ja: {
    name: '日本語',
    code: 'ja',
  },
  de: {
    name: 'German',
    code: 'de',
  },
  zh: {
    name: '简体中文',
    code: 'zh',
  },
} as const

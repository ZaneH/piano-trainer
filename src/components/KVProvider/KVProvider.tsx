import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { InstrumentName } from 'soundfont-player'
import { Store } from '@tauri-apps/plugin-store'
import { AVAILABLE_SETTINGS, MidiDevice, PTSettingsKeyType } from '../../utils'
import {
  AVAILABLE_LANGUAGES,
  SupportedLanguagesType,
} from '../../utils/languages'

type KVContextType = {
  children?: React.ReactNode

  isLoading?: boolean
  pianoSound?: InstrumentName
  showKeyboard?: boolean
  muteSound?: boolean
  midiDevice?: MidiDevice
  language?: SupportedLanguagesType
  isSentryOn?: boolean

  setIsLoading?: Dispatch<SetStateAction<boolean>>
  setPianoSound?: Dispatch<SetStateAction<InstrumentName>>
  setShowKeyboard?: Dispatch<SetStateAction<boolean>>
  setMuteSound?: Dispatch<SetStateAction<boolean>>
  setMidiDevice?: Dispatch<SetStateAction<MidiDevice>>
  setLanguage?: Dispatch<SetStateAction<SupportedLanguagesType>>
  setIsSentryOn?: Dispatch<SetStateAction<boolean>>

  saveSetting?: (key: PTSettingsKeyType, value: any) => void
}

export const KVContext = createContext({} as KVContextType)

/**
 * Responsible for providing persistant storage and reacting to
 * modified states (Settings)
 */
const KVProvider: FC<KVContextType> = ({ children }) => {
  const [store, setStore] = useState<Store | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pianoSound, setPianoSound] = useState(
    'acoustic_grand_piano' as InstrumentName
  )
  const [showKeyboard, setShowKeyboard] = useState(true)
  const [muteSound, setMuteSound] = useState(false)
  const [midiDevice, setMidiDevice] = useState<MidiDevice>({
    id: 0,
    name: 'default',
  })
  const [language, setLanguage] = useState(AVAILABLE_LANGUAGES.en.code)
  const [isSentryOn, setIsSentryOn] = useState(true)
  const { i18n } = useTranslation()

  useEffect(() => {
    const initStore = async () => {
      const storeInstance = await Store.load('.settings.dat')
      setStore(storeInstance)
    }
    initStore()
  }, [])

  /**
   * Map settings stored on-disk into the KVProvider's state
   */
  const loadSettingIntoState = useCallback(
    async (key: PTSettingsKeyType) => {
      if (!store) return
      const value = await store.get(key)
      if (value === null) return

      switch (key) {
        case 'piano-sound':
          setPianoSound(value as InstrumentName)
          break
        case 'show-keyboard':
          setShowKeyboard(Boolean(value))
          break
        case 'mute-sound':
          setMuteSound(Boolean(value))
          break
        case 'midi-input-id':
          setMidiDevice({
            id: Number(value),
          })
          break
        case 'language':
          setLanguage(value as SupportedLanguagesType)
          break
        case 'is-sentry-on':
          setIsSentryOn(Boolean(value))
          break
      }
    },
    [
      store,
      setPianoSound,
      setShowKeyboard,
      setMuteSound,
      setMidiDevice,
      setLanguage,
      setIsSentryOn,
    ]
  )

  /**
   * Store value on-disk
   */
  const saveSetting = useCallback(
    async (key: PTSettingsKeyType, value: any) => {
      if (isLoading || !store) return
      await store.set(key, value)
      await store.save()
    },
    [store, isLoading]
  )

  useEffect(() => {
    saveSetting('piano-sound', pianoSound)
  }, [pianoSound, saveSetting])

  useEffect(() => {
    saveSetting('show-keyboard', showKeyboard)
  }, [showKeyboard, saveSetting])

  useEffect(() => {
    saveSetting('mute-sound', muteSound)
  }, [muteSound, saveSetting])

  useEffect(() => {
    saveSetting('midi-input-id', midiDevice?.id || 0)
  }, [midiDevice?.id, saveSetting])

  useEffect(() => {
    if (language in AVAILABLE_LANGUAGES) {
      i18n.changeLanguage(language)
    }

    saveSetting('language', language)
  }, [language, saveSetting, i18n])

  useEffect(() => {
    saveSetting('is-sentry-on', isSentryOn)
  }, [isSentryOn, saveSetting])

  /**
   * We want to fetch all of the settings stored on-disk and
   * load them into the state when KVProvider is mounted
   */
  useEffect(() => {
    const loadSettings = async () => {
      if (!store) return
      try {
        for (const setting of AVAILABLE_SETTINGS) {
          await loadSettingIntoState(setting.key as PTSettingsKeyType)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    loadSettings()
  }, [store, loadSettingIntoState])

  const context: KVContextType = {
    isLoading,
    pianoSound,
    showKeyboard,
    muteSound,
    midiDevice,
    language,
    isSentryOn,

    setIsLoading,
    setPianoSound,
    setShowKeyboard,
    setMuteSound,
    setMidiDevice,
    setLanguage,
    setIsSentryOn,
    saveSetting,
  }

  return (
    <KVContext.Provider value={context}>
      {!isLoading && children}
    </KVContext.Provider>
  )
}

export default KVProvider

/**
 * Provider component for the Settings (KV) Context
 */
import { FC, ReactNode, useCallback, useEffect, useState } from 'react'
import { load } from '@tauri-apps/plugin-store'
import { KVContext } from '../contexts/SettingsContext'
import { MidiDevice, PTSettingsKeyType } from '../models/types'

// Create/load the store instance for persistent settings
const storePromise = load('.settings.dat', { autoSave: false })

interface KVProviderProps {
  children: ReactNode
}

const KVProvider: FC<KVProviderProps> = ({ children }) => {
  // Piano settings
  const [pianoSound, setPianoSound] = useState<string>('acoustic_grand_piano')
  const [showKeyboard, setShowKeyboard] = useState<boolean>(true)
  const [muteSound, setMuteSound] = useState<boolean>(false)

  // MIDI settings
  const [midiDevice, setMidiDevice] = useState<MidiDevice | null>(null)

  // App settings
  const [language, setLanguage] = useState<string>('en')
  const [isSentryEnabled, setIsSentryEnabled] = useState<boolean>(true)

  // Generic setting handlers
  const setSetting = useCallback(
    async <T,>(key: PTSettingsKeyType, value: T) => {
      const store = await storePromise
      await store.set(key, value)
      await store.save()

      // Update local state based on the setting
      switch (key) {
        case 'piano-sound':
          setPianoSound(value as string)
          break
        case 'show-keyboard':
          setShowKeyboard(value as boolean)
          break
        case 'mute-sound':
          setMuteSound(value as boolean)
          break
        case 'midi-input-id':
          setMidiDevice({ id: value as number })
          break
        case 'language':
          setLanguage(value as string)
          break
        case 'is-sentry-on':
          setIsSentryEnabled(value as boolean)
          break
      }
    },
    []
  )

  const getSetting = useCallback(
    async <T,>(key: PTSettingsKeyType): Promise<T | undefined> => {
      const store = await storePromise
      return await store.get<T>(key)
    },
    []
  )

  // Load all settings on initial render
  useEffect(() => {
    const loadSettings = async () => {
      const store = await storePromise

      const savedPianoSound = await store.get<string>('piano-sound')
      if (savedPianoSound) setPianoSound(savedPianoSound)

      const savedShowKeyboard = await store.get<boolean>('show-keyboard')
      if (savedShowKeyboard !== undefined) setShowKeyboard(savedShowKeyboard)

      const savedMuteSound = await store.get<boolean>('mute-sound')
      if (savedMuteSound !== undefined) setMuteSound(savedMuteSound)

      const savedMidiInputId = await store.get<number>('midi-input-id')
      if (savedMidiInputId !== undefined)
        setMidiDevice({ id: savedMidiInputId })

      const savedLanguage = await store.get<string>('language')
      if (savedLanguage) setLanguage(savedLanguage)

      const savedIsSentryOn = await store.get<boolean>('is-sentry-on')
      if (savedIsSentryOn !== undefined) setIsSentryEnabled(savedIsSentryOn)
    }

    loadSettings()
  }, [])

  return (
    <KVContext.Provider
      value={{
        // Piano settings
        pianoSound,
        setPianoSound: (sound) => setSetting('piano-sound', sound),

        // Display settings
        showKeyboard,
        setShowKeyboard: (show) => setSetting('show-keyboard', show),

        // Sound settings
        muteSound,
        setMuteSound: (mute) => setSetting('mute-sound', mute),

        // MIDI settings
        midiDevice,
        setMidiDevice: (device) =>
          device && setSetting('midi-input-id', device.id),

        // App settings
        language,
        setLanguage: (lang) => setSetting('language', lang),
        isSentryEnabled,
        setIsSentryEnabled: (enabled) => setSetting('is-sentry-on', enabled),

        // Generic settings
        setSetting,
        getSetting,
      }}
    >
      {children}
    </KVContext.Provider>
  )
}

export default KVProvider

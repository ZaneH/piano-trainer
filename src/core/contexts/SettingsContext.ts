import { createContext, useContext } from 'react'
import { MidiDevice, PTSettingsKeyType } from '../models/types'

interface KVContextType {
  pianoSound: string
  setPianoSound: (sound: string) => void

  showKeyboard: boolean
  setShowKeyboard: (show: boolean) => void

  muteSound: boolean
  setMuteSound: (mute: boolean) => void

  midiDevice: MidiDevice | null
  setMidiDevice: (device: MidiDevice | null) => void

  language: string
  setLanguage: (language: string) => void

  isSentryEnabled: boolean
  setIsSentryEnabled: (enabled: boolean) => void

  setSetting: <T>(key: PTSettingsKeyType, value: T) => void
  getSetting: <T>(key: PTSettingsKeyType) => Promise<T | undefined>
}

export const KVContext = createContext<KVContextType | null>(null)

export function useSettings(): KVContextType {
  const context = useContext(KVContext)
  if (!context) {
    throw new Error('useSettings must be used within a KVProvider')
  }
  return context
}

import { createContext, useContext } from 'react'
import { MidiDevice, PTSettingsKeyType } from '../models/types'

interface KVContextType {
  // Piano settings
  pianoSound: string
  setPianoSound: (sound: string) => void

  // Display settings
  showKeyboard: boolean
  setShowKeyboard: (show: boolean) => void

  // Sound settings
  muteSound: boolean
  setMuteSound: (mute: boolean) => void

  // MIDI settings
  midiDevice: MidiDevice | null
  setMidiDevice: (device: MidiDevice | null) => void

  // App settings
  language: string
  setLanguage: (language: string) => void
  isSentryEnabled: boolean
  setIsSentryEnabled: (enabled: boolean) => void

  // Generic setter for any setting
  setSetting: <T>(key: PTSettingsKeyType, value: T) => void
  getSetting: <T>(key: PTSettingsKeyType) => T | undefined
}

export const KVContext = createContext<KVContextType | null>(null)

export function useSettings(): KVContextType {
  const context = useContext(KVContext)
  if (!context) {
    throw new Error('useSettings must be used within a KVProvider')
  }
  return context
}

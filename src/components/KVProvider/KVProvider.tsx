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
import { Store } from 'tauri-plugin-store-api'
import { AVAILABLE_SETTINGS, MidiDevice, PTSettingsKeyType } from '../../utils'

type KVContextType = {
  children?: React.ReactNode

  isLoading?: boolean
  pianoSound?: string
  showKeyboard?: boolean
  muteSound?: boolean
  midiDevice?: MidiDevice

  setIsLoading?: Dispatch<SetStateAction<boolean>>
  setPianoSound?: Dispatch<SetStateAction<string>>
  setShowKeyboard?: Dispatch<SetStateAction<boolean>>
  setMuteSound?: Dispatch<SetStateAction<boolean>>
  setMidiDevice?: Dispatch<SetStateAction<MidiDevice>>

  saveSetting?: (key: PTSettingsKeyType, value: any) => void
}

export const KVContext = createContext({} as KVContextType)

/**
 * Responsible for providing persistant storage and reacting to
 * modified states (Settings)
 */
const KVProvider: FC<KVContextType> = ({ children }) => {
  const store = useMemo(() => new Store('.settings.dat'), [])
  const [isLoading, setIsLoading] = useState(true)
  const [pianoSound, setPianoSound] = useState('acoustic_grand_piano')
  const [showKeyboard, setShowKeyboard] = useState(true)
  const [muteSound, setMuteSound] = useState(false)
  const [midiDevice, setMidiDevice] = useState<MidiDevice>({
    id: 0,
    name: 'default',
  })

  /**
   * Map settings stored on-disk into the KVProvider's state
   */
  const loadSettingIntoState = useCallback(
    (key: PTSettingsKeyType) => {
      return store.get(key).then((value) => {
        if (value === null) return
        switch (key) {
          case 'piano-sound':
            setPianoSound(String(value))
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
        }
      })
    },
    [setPianoSound, setShowKeyboard, setMuteSound, setMidiDevice, store]
  )

  /**
   * Store value on-disk
   */
  const saveSetting = useCallback(
    (key: PTSettingsKeyType, value: any) => {
      if (isLoading) return
      store.set(key, value)
      store.save()
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

  /**
   * We want to fetch all of the settings stored on-disk and
   * load them into the state when KVProvider is mounted
   */
  useEffect(() => {
    store
      .load()
      .then(async () => {
        for (const setting of AVAILABLE_SETTINGS) {
          await loadSettingIntoState(setting.key as PTSettingsKeyType)
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setIsLoading(false))
  }, [store, loadSettingIntoState, setIsLoading])

  const context: KVContextType = {
    isLoading,
    pianoSound,
    showKeyboard,
    muteSound,
    midiDevice,
    setIsLoading,
    setPianoSound,
    setShowKeyboard,
    setMuteSound,
    setMidiDevice,
    saveSetting,
  }

  return (
    <KVContext.Provider value={context}>
      {!isLoading && children}
    </KVContext.Provider>
  )
}

export default KVProvider

import styled from 'styled-components'
import { MidiDevice, PTSettingType } from '../../utils'
import UncheckedIcon from 'remixicon-react/CheckboxBlankCircleLineIcon'
import CheckedIcon from 'remixicon-react/CheckboxCircleFillIcon'
import { useContext, useEffect, useState } from 'react'
import { KVContext } from '../KVProvider'
import { invoke } from '@tauri-apps/api'
import Select from 'react-select'

const SettingRowContainer = styled.div`
  margin: 24px 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.1em;
  cursor: pointer;
  z-index: 15;

  .settings-row-label {
    color: rgba(255, 255, 255, 0.7);
  }
`

interface SettingRowProps {
  setting: PTSettingType
  value: string | boolean | number | undefined
}

const SettingRow = ({ setting, value }: SettingRowProps) => {
  const {
    setMuteSound,
    setShowKeyboard,
    setMidiDevice: setConnectedMidiDevice,
  } = useContext(KVContext)

  const [midiDevices, setMidiDevices] = useState<MidiDevice[]>([])

  // TODO: This will probably fit in a future hook
  useEffect(() => {
    if (setting.key === 'midi-input-id') {
      invoke('list_midi_connections').then((devices) => {
        const devicesObject = devices as { [key: string]: string }
        const midiConnectionKeys = Object.keys(devicesObject as {})
        setMidiDevices([])
        midiConnectionKeys.forEach((ck) => {
          setMidiDevices((md) => [
            ...md,
            {
              id: Number(ck),
              name: devicesObject[ck],
            } as MidiDevice,
          ])
        })
      })
    }
  }, [setting.key])

  if (setting.key === 'midi-input-id') {
    if (!Array.isArray(midiDevices)) return null
    const connectedMidiDevice = midiDevices[Number(value)]

    return (
      <SettingRowContainer>
        <span className='settings-row-label'>{setting.label}</span>
        <Select
          options={midiDevices.map((d) => ({
            value: d.id,
            label: d.name || `Name: N/A :: ID: ${d.id}`,
          }))}
          value={{
            value: connectedMidiDevice?.id || 0,
            label: connectedMidiDevice?.name || 'N/A',
          }}
          onChange={(e) => {
            try {
              const newMidiDevice = midiDevices.find((md) => md.id === e?.value)
              if (newMidiDevice) {
                setConnectedMidiDevice?.(newMidiDevice)
              }
            } catch (e) {
              console.error('There was an error connecting to MIDI', e)
            }
          }}
        />
      </SettingRowContainer>
    )
  }

  return (
    <SettingRowContainer
      onClick={() => {
        switch (setting.key) {
          case 'mute-sound':
            setMuteSound?.((v) => !v)
            break
          case 'show-keyboard':
            setShowKeyboard?.((v) => !v)
            break
        }
      }}
    >
      <span className='settings-row-label'>{setting.label}</span>

      {value ? (
        <CheckedIcon color='white' size={32} />
      ) : (
        <UncheckedIcon color='white' size={32} />
      )}
    </SettingRowContainer>
  )
}

export default SettingRow

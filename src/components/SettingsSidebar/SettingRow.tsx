import { useTranslation } from 'react-i18next'
import Select from 'react-select'
import UncheckedIcon from 'remixicon-react/CheckboxBlankCircleLineIcon'
import CheckedIcon from 'remixicon-react/CheckboxCircleFillIcon'
import { InstrumentName } from 'soundfont-player'
import styled from 'styled-components'
import { AVAILABLE_SOUNDS, PTSettingType } from '../../utils'
import {
  AVAILABLE_LANGUAGES,
  SupportedLanguagesType,
} from '../../utils/languages'
import { useSettings } from '../../core/contexts/SettingsContext'
import { useMidiDevices } from '../../core/hooks/useMidiDevices'

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
    setLanguage,
    setIsSentryEnabled,
    setPianoSound,
  } = useSettings()
  const { t } = useTranslation()

  const { devices } = useMidiDevices()

  // Render Dropdown inputs
  if (setting.key === 'midi-input-id') {
    if (!Array.isArray(devices)) return null
    const connectedMidiDevice = devices[Number(value)]

    return (
      <SettingRowContainer>
        <span className='settings-row-label'>
          {t(`settings.options.${setting.key}`)}
        </span>
        <Select
          options={devices.map((d) => ({
            value: d.id,
            label: d?.name || `Name: N/A :: ID: ${d.id}`,
          }))}
          value={{
            value: connectedMidiDevice?.id || 0,
            label: connectedMidiDevice?.name || 'N/A',
          }}
          onChange={(e) => {
            try {
              const newMidiDevice = devices.find((md) => md.id === e?.value)
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
  } else if (setting.key === 'language') {
    return (
      <SettingRowContainer>
        <span className='settings-row-label'>
          {t(`settings.options.${setting.key}`)}
        </span>
        <Select
          options={Object.keys(AVAILABLE_LANGUAGES).map((code) => ({
            label: AVAILABLE_LANGUAGES[code as SupportedLanguagesType]?.name,
            value: code,
          }))}
          value={{
            label: AVAILABLE_LANGUAGES[value as SupportedLanguagesType]?.name,
            value,
          }}
          onChange={(e) => {
            setLanguage?.(e?.value as SupportedLanguagesType)
          }}
        />
      </SettingRowContainer>
    )
  } else if (setting.key === 'piano-sound') {
    return (
      <SettingRowContainer>
        <span className='settings-row-label'>
          {t(`settings.options.${setting.key}`)}
        </span>
        <Select
          options={Object.keys(AVAILABLE_SOUNDS).map((soundKey) => ({
            label:
              t(`settings.options.sounds.${soundKey as InstrumentName}`) ||
              'N/A',
            value: soundKey,
          }))}
          value={{
            label:
              t(`settings.options.sounds.${value as InstrumentName}`) || 'N/A',
            value,
          }}
          onChange={(e) => {
            setPianoSound?.(e?.value as InstrumentName)
          }}
        />
      </SettingRowContainer>
    )
  }

  // Render boolean options
  return (
    <SettingRowContainer
      onClick={() => {
        switch (setting.key) {
          case 'mute-sound':
            setMuteSound?.(!value)
            break
          case 'show-keyboard':
            setShowKeyboard?.(!value)
            break
          case 'is-sentry-on':
            setIsSentryEnabled?.(!value)
            break
        }
      }}
    >
      <span className='settings-row-label'>
        {t(`settings.options.${setting.key}`)}
      </span>

      {value ? (
        <CheckedIcon color='white' size={32} />
      ) : (
        <UncheckedIcon color='white' size={32} />
      )}
    </SettingRowContainer>
  )
}

export default SettingRow

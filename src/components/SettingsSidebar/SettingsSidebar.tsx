import { useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { AVAILABLE_SETTINGS, PTSettingType } from '../../utils'
import { KVContext } from '../KVProvider'
import { SidebarContext } from '../SidebarProvider'
import SettingRow from './SettingRow'

const CoverScreen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const FadeOut = styled.div`
  flex: 2.5;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 9;
`

const Sidebar = styled.div`
  flex: 2;
  background-color: #09090a;
  z-index: 10;

  h1 {
    color: white;
    margin: 48px 32px;
    margin-bottom: 12px;
  }
`

const SettingsSidebar = () => {
  const {
    showKeyboard,
    muteSound,
    midiDevice,
    language,
    isSentryOn,
    pianoSound,
  } = useContext(KVContext)
  const { setIsOpen } = useContext(SidebarContext)
  const { t } = useTranslation()

  const renderSettingRow = useCallback(
    (s: PTSettingType) => {
      switch (s.key) {
        case 'show-keyboard':
          return <SettingRow key={s.key} setting={s} value={showKeyboard} />
        case 'mute-sound':
          return <SettingRow key={s.key} setting={s} value={muteSound} />
        case 'language':
          return <SettingRow key={s.key} setting={s} value={language} />
        case 'midi-input-id':
          return (
            <SettingRow key={s.key} setting={s} value={midiDevice?.id || 0} />
          )
        case 'is-sentry-on':
          return <SettingRow key={s.key} setting={s} value={isSentryOn} />
        case 'piano-sound':
          return <SettingRow key={s.key} setting={s} value={pianoSound} />
      }
    },
    [showKeyboard, muteSound, isSentryOn, midiDevice?.id, language, pianoSound]
  )

  return (
    <CoverScreen>
      <FadeOut onClick={() => setIsOpen?.(false)} />
      <Sidebar>
        <h1>{t('settings.title')}</h1>
        {AVAILABLE_SETTINGS.map((s) => renderSettingRow(s))}
      </Sidebar>
    </CoverScreen>
  )
}

export default SettingsSidebar

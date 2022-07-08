import styled from 'styled-components'
import { AVAILABLE_SETTINGS } from '../../utils'
import { useContext } from 'react'
import { KVContext } from '../KVProvider'
import SettingRow from './SettingRow'
import { SidebarContext } from '../SidebarProvider'

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
  const { showKeyboard, muteSound } = useContext(KVContext)
  const { setIsOpen } = useContext(SidebarContext)

  return (
    <CoverScreen>
      <FadeOut onClick={() => setIsOpen?.(false)} />
      <Sidebar>
        <h1>Settings</h1>
        {AVAILABLE_SETTINGS.map((s) => (
          <>
            {s.key === 'show-keyboard' && (
              <SettingRow key={s.key} setting={s} value={showKeyboard} />
            )}
            {s.key === 'mute-sound' && (
              <SettingRow key={s.key} setting={s} value={muteSound} />
            )}
          </>
        ))}
      </Sidebar>
    </CoverScreen>
  )
}

export default SettingsSidebar

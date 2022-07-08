import styled from 'styled-components'
import { PTSettingType } from '../../utils'
import UncheckedIcon from 'remixicon-react/CheckboxBlankCircleLineIcon'
import CheckedIcon from 'remixicon-react/CheckboxCircleFillIcon'
import { useContext } from 'react'
import { KVContext } from '../KVProvider'

const SettingRowContainer = styled.div`
  color: rgba(255, 255, 255, 0.7);
  margin: 24px 42px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.1em;
  cursor: pointer;
`

interface SettingRowProps {
  setting: PTSettingType
  value: string | boolean | undefined
}

const SettingRow = ({ setting, value }: SettingRowProps) => {
  const { setMuteSound, setShowKeyboard } = useContext(KVContext)

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
      {setting.label}

      {value ? (
        <CheckedIcon color='white' size={32} />
      ) : (
        <UncheckedIcon color='white' size={32} />
      )}
    </SettingRowContainer>
  )
}

export default SettingRow

import { useContext } from 'react'
import Select from 'react-select'
import styled from 'styled-components'
import {
  AvailablePracticeModesType,
  AvailableScalesType,
  AVAILABLE_MODES,
  AVAILABLE_SCALES,
} from '../../utils'
import { TrainerContext } from '../TrainerProvider'
import ArrowLeftRight from 'remixicon-react/ArrowLeftRightFillIcon'

const TrainerDisplayContainer = styled.div`
  display: flex;
  z-index: 2;
  align-self: center;
  font-family: 'Arial', 'Helvetica', sans-serif;
  flex-direction: row;
  gap: 12vw;
`

const TrainerSection = styled.div`
  width: 20vw;
  & > h2 {
    color: white;
    margin-bottom: 12px;
  }
`

const IconContainer = styled.div`
  padding: 16px;
  display: inline-block;
`

const TrainerDisplay = () => {
  const {
    scale,
    setScale,
    practiceMode,
    setPracticeMode,
    isScalePingPong,
    setIsScalePingPong,
  } = useContext(TrainerContext)

  const scaleOptions = Object.keys(AVAILABLE_SCALES).map((s: string) => ({
    label: AVAILABLE_SCALES[s as AvailableScalesType].label,
    value: AVAILABLE_SCALES[s as AvailableScalesType].value,
  }))

  const modeOptions = Object.keys(AVAILABLE_MODES).map((s: string) => ({
    label: AVAILABLE_MODES[s as AvailablePracticeModesType].label,
    value: AVAILABLE_MODES[s as AvailablePracticeModesType].value,
  }))

  return (
    <TrainerDisplayContainer>
      <TrainerSection>
        <h2>Scale</h2>
        <Select
          options={scaleOptions}
          value={{
            label: AVAILABLE_SCALES[scale?.value as AvailableScalesType].label,
            value: AVAILABLE_SCALES[scale?.value as AvailableScalesType].value,
          }}
          onChange={(e) => {
            setScale?.(AVAILABLE_SCALES[e?.value as AvailableScalesType])
          }}
        />
        <IconContainer title='Enable ping-pong scale practice'>
          <ArrowLeftRight
            color={isScalePingPong ? '#70bcd3' : 'white'}
            onClick={() => setIsScalePingPong?.((isPingPong) => !isPingPong)}
            cursor='pointer'
          />
        </IconContainer>
      </TrainerSection>

      <TrainerSection>
        <h2>Mode</h2>
        <Select
          value={{
            label: AVAILABLE_MODES[practiceMode!].label,
            value: AVAILABLE_MODES[practiceMode!].value,
          }}
          options={modeOptions}
          onChange={(e) => {
            setPracticeMode?.(e?.value as AvailablePracticeModesType)
          }}
        />
      </TrainerSection>
    </TrainerDisplayContainer>
  )
}

export default TrainerDisplay

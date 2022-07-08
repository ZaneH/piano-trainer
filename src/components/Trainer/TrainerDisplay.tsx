import { useContext, useMemo } from 'react'
import Select, { createFilter } from 'react-select'
import styled from 'styled-components'
import {
  AvailablePracticeModesType,
  AvailableMajorScalesType,
  AVAILABLE_MODES,
  AVAILABLE_SCALES,
} from '../../utils'
import { TrainerContext } from '../TrainerProvider'
import SettingsIcon from 'remixicon-react/Settings2FillIcon'
import ArrowLeftRightIcon from 'remixicon-react/ArrowLeftRightFillIcon'
import SkullIcon from 'remixicon-react/SkullFillIcon'
import QuizIcon from 'remixicon-react/SurveyFillIcon'
import { SidebarContext } from '../SidebarProvider'

const TrainerDisplayContainer = styled.div`
  display: flex;
  z-index: 2;
  align-self: center;
  flex-direction: row;
  gap: 12vw;
`

const TrainerSection = styled.div`
  width: 20vw;
  min-width: 250px;
`

const TrainerSectionHeader = styled.div`
  margin-bottom: 12px;
  & > h2 {
    color: white;
    margin: 12px 0;
    display: inline-block;
  }
`

const IconContainer = styled.div`
  padding: 8px;
  margin-left: 12px;
  width: 2em;
  height: 2em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: white;
  float: right;
  cursor: pointer;
`

const TrainerDisplay = () => {
  const {
    scale,
    setScale,
    practiceMode,
    setPracticeMode,
    setCurrentScreen,
    isScalePingPong,
    setIsScalePingPong,
    isHardModeEnabled,
    setIsHardModeEnabled,
  } = useContext(TrainerContext)
  const { setIsOpen } = useContext(SidebarContext)

  const scaleOptions = Object.keys(AVAILABLE_SCALES).map((s: string) => ({
    label: AVAILABLE_SCALES[s as AvailableMajorScalesType].label,
    value: AVAILABLE_SCALES[s as AvailableMajorScalesType].value,
  }))

  const modeOptions = Object.keys(AVAILABLE_MODES).map((s: string) => ({
    label: AVAILABLE_MODES[s as AvailablePracticeModesType].label,
    value: AVAILABLE_MODES[s as AvailablePracticeModesType].value,
  }))

  const fromStartFilter = useMemo(
    () =>
      createFilter({
        matchFrom: 'start',
      }),
    []
  )

  return (
    <TrainerDisplayContainer>
      <TrainerSection>
        <TrainerSectionHeader>
          <h2>Scale</h2>
          <IconContainer
            title='Toggle ping-pong scale practice'
            onClick={() => setIsScalePingPong?.((isPingPong) => !isPingPong)}
          >
            <ArrowLeftRightIcon
              color={isScalePingPong ? '#70bcd3' : '#1f1f20'}
            />
          </IconContainer>
          <IconContainer
            title='Toggle hard mode'
            onClick={() => setIsHardModeEnabled?.((isHard) => !isHard)}
          >
            <SkullIcon color={isHardModeEnabled ? '#70bcd3' : '#1f1f20'} />
          </IconContainer>
        </TrainerSectionHeader>
        <Select
          filterOption={fromStartFilter}
          options={scaleOptions}
          value={{
            label:
              AVAILABLE_SCALES[scale?.value as AvailableMajorScalesType].label,
            value:
              AVAILABLE_SCALES[scale?.value as AvailableMajorScalesType].value,
          }}
          onChange={(e) => {
            setScale?.(AVAILABLE_SCALES[e?.value as AvailableMajorScalesType])
          }}
        />
      </TrainerSection>

      <TrainerSection>
        <TrainerSectionHeader>
          <h2>Mode</h2>
          <IconContainer
            title='Switch to quiz mode'
            onClick={() => setCurrentScreen?.('quiz')}
          >
            <QuizIcon color='#1f1f20' />
          </IconContainer>
          <IconContainer
            title='Open settings'
            onClick={() => setIsOpen?.(true)}
          >
            <SettingsIcon color='#1f1f20' />
          </IconContainer>
        </TrainerSectionHeader>
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

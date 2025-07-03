import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import Select, { createFilter } from 'react-select'
import ArrowLeftRightIcon from 'remixicon-react/ArrowLeftRightFillIcon'
import SettingsIcon from 'remixicon-react/Settings2FillIcon'
import SkullIcon from 'remixicon-react/SkullFillIcon'
import QuizIcon from 'remixicon-react/SurveyFillIcon'
import ShuffleIcon from 'remixicon-react/ShuffleFillIcon'
import styled from 'styled-components'
import { useSidebar } from '../../core/contexts/SidebarContext'
import { useTrainer } from '../../core/contexts/TrainerContext'
import { AVAILABLE_MODES } from '../../core/models/constants'
import { AvailablePracticeModesType } from '../../core/models/types'
import { AVAILABLE_SCALES } from '../../utils'

const TrainerDisplayContainer = styled.div`
  display: flex;
  z-index: 2;
  align-self: center;
  flex-direction: row;
  gap: 12vw;
`

const TrainerSection = styled.div`
  width: 40dvw;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const TrainerSectionHeader = styled.div`
  & > h2 {
    color: white;
    margin: 0;
    display: inline-block;
  }
`

const IconContainer = styled.div`
  padding: 8px;
  margin-right: 12px;
  margin-top: 8px;
  width: 2em;
  height: 2em;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: white;
  cursor: pointer;
`

const TrainerDisplay = () => {
  const {
    scale,
    setScale,
    selectedScales,
    setSelectedScales,
    practiceMode,
    setPracticeMode,
    setCurrentScreen,
    isScalePingPong,
    setIsScalePingPong,
    isHardModeEnabled,
    setIsHardModeEnabled,
    isShuffleModeEnabled,
    setIsShuffleModeEnabled,
  } = useTrainer()
  const { setIsOpen } = useSidebar()
  const { t } = useTranslation()

  const scaleOptions = Object.keys(AVAILABLE_SCALES).map((s: string) => ({
    label: t(
      `scales.${AVAILABLE_SCALES[s as keyof typeof AVAILABLE_SCALES].value}`
    ),
    value: AVAILABLE_SCALES[s as keyof typeof AVAILABLE_SCALES].value,
  }))

  const modeOptions = Object.keys(AVAILABLE_MODES).map((s: string) => ({
    label: t(
      `practiceModes.${AVAILABLE_MODES[s as AvailablePracticeModesType].value}`
    ),
    value: AVAILABLE_MODES[s as AvailablePracticeModesType].value,
  }))

  const fromStartFilter = useMemo(
    () =>
      createFilter({
        matchFrom: 'start',
      }),
    []
  )

  const handleScaleChange = (selectedOption: any) => {
    if (isShuffleModeEnabled) {
      // Multi-select mode
      const newSelection =
        selectedOption?.map(
          (option: any) =>
            AVAILABLE_SCALES[option.value as keyof typeof AVAILABLE_SCALES]
        ) || []

      if (newSelection.length > 0) {
        setSelectedScales?.(newSelection)
      }
    } else {
      // Single select mode
      setScale?.(
        AVAILABLE_SCALES[selectedOption?.value as keyof typeof AVAILABLE_SCALES]
      )
    }
  }

  const getSelectValue = () => {
    if (isShuffleModeEnabled) {
      // Return array of selected scales for multi-select
      return (
        selectedScales?.map((scale) => ({
          label: t(`scales.${scale.value}`),
          value: scale.value,
        })) || []
      )
    } else {
      // Return single scale
      return {
        label: t(
          `scales.${
            AVAILABLE_SCALES[scale?.value as keyof typeof AVAILABLE_SCALES]
              .value
          }`
        ),
        value:
          AVAILABLE_SCALES[scale?.value as keyof typeof AVAILABLE_SCALES].value,
      }
    }
  }

  return (
    <TrainerDisplayContainer>
      <TrainerSection>
        <TrainerSectionHeader>
          <h2>{t('pages.practice.scale.title')}</h2>
        </TrainerSectionHeader>
        <Select
          filterOption={fromStartFilter}
          options={scaleOptions}
          value={getSelectValue()}
          onChange={handleScaleChange}
          isMulti={isShuffleModeEnabled}
        />
        <div>
          <IconContainer
            title={t('pages.practice.scale.pingPongHint')}
            onClick={() => setIsScalePingPong?.(!isScalePingPong)}
          >
            <ArrowLeftRightIcon
              color={isScalePingPong ? '#70bcd3' : '#1f1f20'}
            />
          </IconContainer>
          <IconContainer
            title={t('pages.practice.scale.hardModeHint')}
            onClick={() => setIsHardModeEnabled?.(!isHardModeEnabled)}
          >
            <SkullIcon color={isHardModeEnabled ? '#70bcd3' : '#1f1f20'} />
          </IconContainer>
          <IconContainer
            title={t('pages.practice.scale.shuffleModeHint')}
            onClick={() => setIsShuffleModeEnabled?.(!isShuffleModeEnabled)}
          >
            <ShuffleIcon color={isShuffleModeEnabled ? '#70bcd3' : '#1f1f20'} />
          </IconContainer>
        </div>
      </TrainerSection>

      <TrainerSection>
        <TrainerSectionHeader>
          <h2>{t('pages.practice.mode.title')}</h2>
        </TrainerSectionHeader>
        <Select
          value={{
            label: t(`practiceModes.${AVAILABLE_MODES[practiceMode!].value}`),
            value: AVAILABLE_MODES[practiceMode!].value,
          }}
          options={modeOptions}
          onChange={(e) => {
            setPracticeMode?.(e?.value as AvailablePracticeModesType)
          }}
        />
        <div>
          <IconContainer
            title={t('pages.practice.mode.quizModeHint')}
            onClick={() => setCurrentScreen?.('quiz')}
          >
            <QuizIcon color='#1f1f20' />
          </IconContainer>
          <IconContainer
            title={t('pages.practice.mode.settingsHint')}
            onClick={() => setIsOpen?.(true)}
          >
            <SettingsIcon color='#1f1f20' />
          </IconContainer>
        </div>
      </TrainerSection>
    </TrainerDisplayContainer>
  )
}

export default TrainerDisplay

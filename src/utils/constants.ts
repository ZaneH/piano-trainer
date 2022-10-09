import { ScaleType } from '.'
import { MajorMinorType } from '../components/Quiz/Questions'
import {
  AvailableMajorScalesType,
  AVAILABLE_MAJOR_SCALES,
} from './scales/major'
import {
  AvailableMinorMelodicScalesType,
  AVAILABLE_MINOR_MELODIC_SCALES,
} from './scales/minor.melodic'
import {
  AvailableMinorNaturalScalesType,
  AVAILABLE_MINOR_NATURAL_SCALES,
} from './scales/minor.natural'

export const SCALE_LENGTH = 8
export const OCTAVE_LENGTH = 12

export type AvailableAllScalesType =
  | AvailableMajorScalesType
  | AvailableMinorNaturalScalesType
  | AvailableMinorMelodicScalesType

export const AVAILABLE_SCALES: {
  [key in AvailableAllScalesType]: ScaleType
} = {
  ...AVAILABLE_MAJOR_SCALES,
  ...AVAILABLE_MINOR_NATURAL_SCALES,
  ...AVAILABLE_MINOR_MELODIC_SCALES,
}

export type ScaleStepsType = 'w' | 'h'
export const SCALE_STEP_VALUES: { [key in ScaleStepsType]: number } = {
  w: 2,
  h: 1,
}

// TODO: Use these rules to calculate the major.ts, minor.natural.ts, etc.
export const SCALE_STEPS: { [key in MajorMinorType]: string[] } = {
  Major: ['w', 'w', 'h', 'w', 'w', 'w', 'h', 'w'],
  Minor: ['w', 'h', 'w', 'w', 'h', 'w', 'w', 'w'],
}

export type PTSettingsKeyType =
  | 'piano-sound'
  | 'show-keyboard'
  | 'mute-sound'
  | 'midi-input-id'
  | 'language'
  | 'is-sentry-on'

export type PTSettingType = {
  key: PTSettingsKeyType
  type: 'select' | 'checkbox'
  options?: readonly string[]
}

export const AVAILABLE_SETTINGS: readonly PTSettingType[] = [
  {
    key: 'piano-sound',
    type: 'select',
    options: ['Piano Grand'],
  },
  {
    key: 'show-keyboard',
    type: 'checkbox',
  },
  {
    key: 'mute-sound',
    type: 'checkbox',
  },
  {
    key: 'midi-input-id',
    type: 'select',
  },
  {
    key: 'language',
    type: 'checkbox',
  },
  {
    key: 'is-sentry-on',
    type: 'checkbox',
  },
] as const

export * from './midi'
export * from './sounds'

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

export type AvailableScalesType =
  | AvailableMajorScalesType
  | AvailableMinorNaturalScalesType
  | AvailableMinorMelodicScalesType

export const AVAILABLE_SCALES: {
  [key in AvailableScalesType]: ScaleType
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
export const SCALE_STEPS: { [key in MajorMinorType]: string[] } = {
  Major: ['w', 'w', 'h', 'w', 'w', 'w', 'h', 'w'],
  Minor: ['w', 'h', 'w', 'w', 'h', 'w', 'w', 'w'],
}
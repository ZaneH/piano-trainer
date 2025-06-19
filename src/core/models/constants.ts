/**
 * Constants for scales and settings
 */
import { MajorMinorType, PTSettingType, ScaleStepsType } from '../models/types'

// Core constants
export const SCALE_LENGTH = 8
export const OCTAVE_LENGTH = 12

// Scale step values and patterns
export const SCALE_STEP_VALUES: { [key in ScaleStepsType]: number } = {
  w: 2,
  h: 1,
}

export const SCALE_STEPS: { [key in MajorMinorType]: string[] } = {
  Major: ['w', 'w', 'h', 'w', 'w', 'w', 'h', 'w'],
  Minor: ['w', 'h', 'w', 'w', 'h', 'w', 'w', 'w'],
}

// Settings
export const AVAILABLE_SETTINGS: readonly PTSettingType[] = [
  {
    key: 'piano-sound',
    type: 'select',
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
    type: 'select',
  },
  {
    key: 'is-sentry-on',
    type: 'checkbox',
  },
] as const

// Circle of Fifths
export const CIRCLE_OF_FIFTHS: { [key in MajorMinorType]: string[] } = {
  Major: ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab'],
  Minor: ['a', 'e', 'b', 'f#', 'c#', 'g#', 'd#', 'a#', 'd', 'g', 'c', 'f'],
}

/**
 * Core constants for the piano trainer application
 */

import type { AvailablePracticeModesType, PTSettingType } from './types'

// Scale constants
export const SCALE_LENGTH = 8
export const OCTAVE_LENGTH = 12
export const SCALE_STEP_VALUES = { w: 2, h: 1 } as const
export const SCALE_STEPS = {
  Major: ['w', 'w', 'h', 'w', 'w', 'w', 'h'],
  Minor: ['w', 'h', 'w', 'w', 'h', 'w', 'w'], // Natural minor
} as const

export const CIRCLE_OF_FIFTHS = [
  'C',
  'G',
  'D',
  'A',
  'E',
  'B',
  'F#',
  'C#',
  'G#',
  'D#',
  'A#',
  'F',
] as const

export const AVAILABLE_SETTINGS: PTSettingType[] = [
  {
    key: 'piano-sound',
    type: 'select',
    options: [
      'acoustic_grand_piano',
      'acoustic_guitar_nylon',
      'electric_piano_1',
    ] as const,
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
    options: ['en', 'es', 'pt'] as const,
  },
  {
    key: 'is-sentry-on',
    type: 'checkbox',
  },
]

export const AVAILABLE_MODES: {
  [key in AvailablePracticeModesType]: { value: string; label: string }
} = {
  scales: {
    label: 'Scales',
    value: 'scales',
  },
  chords: {
    label: 'Chords',
    value: 'chords',
  },
  seventhChords: {
    label: 'Seventh Chords',
    value: 'seventhChords',
  },
  fifths: {
    label: 'Fifths',
    value: 'fifths',
  },
} as const

export type AvailablePracticeModesType = 'scales' | 'chords'
const AVAILABLE_MODES: {
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
} as const

export { AVAILABLE_MODES }

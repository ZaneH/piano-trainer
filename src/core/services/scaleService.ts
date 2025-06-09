/**
 * Scale service for creating and manipulating scales
 */
import {
  MajorMinorType,
  ScaleType,
  AvailableAllScalesType,
  MidiNumber,
  Note,
  ScaleKeyType,
} from '../models/types'
import {
  SCALE_STEP_VALUES,
  SCALE_STEPS,
  OCTAVE_LENGTH,
} from '../models/constants'
import { MidiNumbers } from 'react-piano'

/**
 * Creates a scale based on a starting note, type, and octave
 */
export function createScale(
  startingNote: Note,
  type: MajorMinorType,
  octave: number = 4
): ScaleType {
  const steps = SCALE_STEPS[type]
  const midiStart = MidiNumbers.fromNote(
    `${startingNote.toLowerCase()}${octave}`
  )

  let currentMidi = midiStart
  const keys: ScaleKeyType = {}

  // Roman numerals for scale degrees
  const scaleNumerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'viiº', 'I']

  // Build the scale
  for (let i = 0; i < steps.length; i++) {
    keys[currentMidi] = scaleNumerals[i]

    if (i < steps.length - 1) {
      const step = steps[i] as 'w' | 'h'
      currentMidi += SCALE_STEP_VALUES[step]
    }
  }

  // Generate the scale name
  let scaleName = startingNote
  if (type === 'Major') {
    scaleName = `${startingNote} Major`
  } else {
    scaleName = `${startingNote} Minor`
  }

  // Generate the scale value (kebab case)
  const noteValue = startingNote
    .toLowerCase()
    .replace('#', '-sharp')
    .replace('b', '-flat')
  const typeValue = type.toLowerCase()

  return {
    label: scaleName,
    value: `${noteValue}-${typeValue}` as AvailableAllScalesType,
    keys,
  }
}

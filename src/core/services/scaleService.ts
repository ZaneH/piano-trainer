/**
 * Scale service for creating and manipulating scales
 */
import {
  MajorMinorType,
  ScaleType,
  AvailableAllScalesType,
  Note,
  ScaleKeyType,
  AvailableMajorScalesType,
} from '../models/types'
import { SCALE_STEP_VALUES, SCALE_STEPS } from '../models/constants'
import { MidiNumbers } from 'react-piano'
import { normalizeNoteName } from './noteService'

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
    `${normalizeNoteName(startingNote.toLowerCase())}${octave}`
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

/**
 * Major scale root notes with their exact MIDI numbers from the original hardcoded scales
 * This ensures we match the original implementation exactly
 */
const MAJOR_SCALE_MIDI_ROOTS = {
  'c-flat-major': 59, // Cb Major
  'c-major': 48, // C Major
  'c-sharp-major': 49, // C# Major
  'd-major': 50, // D Major
  'e-flat-major': 51, // Eb Major
  'e-major': 52, // E Major
  'f-major': 53, // F Major
  'f-sharp-major': 54, // F# Major
  'g-flat-major': 54, // Gb Major (enharmonic with F#)
  'g-major': 55, // G Major
  'a-flat-major': 56, // Ab Major
  'a-major': 57, // A Major
  'b-flat-major': 58, // Bb Major
  'b-major': 59, // B Major
} as const

/**
 * Scale note names for generating proper labels
 */
const SCALE_NOTE_NAMES = {
  'c-flat-major': 'Cb',
  'c-major': 'C',
  'c-sharp-major': 'C#',
  'd-major': 'D',
  'e-flat-major': 'Eb',
  'e-major': 'E',
  'f-major': 'F',
  'f-sharp-major': 'F#',
  'g-flat-major': 'Gb',
  'g-major': 'G',
  'a-flat-major': 'Ab',
  'a-major': 'A',
  'b-flat-major': 'Bb',
  'b-major': 'B',
} as const

/**
 * Creates a major scale using the exact MIDI numbers from the original implementation
 */
function createMajorScaleFromMidi(
  scaleId: AvailableMajorScalesType
): ScaleType {
  const midiStart = MAJOR_SCALE_MIDI_ROOTS[scaleId]
  const scaleName = SCALE_NOTE_NAMES[scaleId]
  const steps = SCALE_STEPS.Major

  let currentMidi = midiStart
  const keys: ScaleKeyType = {}
  const scaleNumerals = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'viiº', 'I']

  // Build the scale
  for (let i = 0; i < 8; i++) {
    keys[currentMidi] = scaleNumerals[i]

    if (i < 7) {
      const step = steps[i] as 'w' | 'h'
      currentMidi += SCALE_STEP_VALUES[step]
    }
  }

  return {
    label: `${scaleName} Major`,
    value: scaleId,
    keys,
  }
}

/**
 * Generate all major scales dynamically using the exact MIDI mappings
 */
export function generateAllMajorScales(): Record<
  AvailableMajorScalesType,
  ScaleType
> {
  const scales: Record<string, ScaleType> = {}

  for (const scaleId of Object.keys(
    MAJOR_SCALE_MIDI_ROOTS
  ) as AvailableMajorScalesType[]) {
    scales[scaleId] = createMajorScaleFromMidi(scaleId)
  }

  return scales as Record<AvailableMajorScalesType, ScaleType>
}

/**
 * Get a specific major scale by its identifier
 */
export function getMajorScale(scaleId: AvailableMajorScalesType): ScaleType {
  return createMajorScaleFromMidi(scaleId)
}

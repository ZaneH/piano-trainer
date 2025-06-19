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
 * Minor natural scale root notes with their MIDI numbers from the original hardcoded scales
 */
const MINOR_NATURAL_SCALE_MIDI_ROOTS = {
  'c-minor-natural': 48, // C Minor Natural
  'c-sharp-minor-natural': 49, // C# Minor Natural
  'd-minor-natural': 50, // D Minor Natural
  'd-sharp-minor-natural': 51, // D# Minor Natural
  'e-flat-minor-natural': 51, // Eb Minor Natural (enharmonic with D#)
  'e-minor-natural': 52, // E Minor Natural
  'f-minor-natural': 53, // F Minor Natural
  'f-sharp-minor-natural': 54, // F# Minor Natural
  'g-minor-natural': 55, // G Minor Natural
  'g-sharp-minor-natural': 56, // G# Minor Natural
  'a-flat-minor-natural': 56, // Ab Minor Natural (enharmonic with G#)
  'a-minor-natural': 57, // A Minor Natural
  'a-sharp-minor-natural': 58, // A# Minor Natural
  'b-flat-minor-natural': 58, // Bb Minor Natural (enharmonic with A#)
  'b-minor-natural': 59, // B Minor Natural
} as const

/**
 * Minor melodic scale root notes with their MIDI numbers from the original hardcoded scales
 */
const MINOR_MELODIC_SCALE_MIDI_ROOTS = {
  'c-minor-melodic': 48, // C Minor Melodic
  'c-sharp-minor-melodic': 49, // C# Minor Melodic
  'd-minor-melodic': 50, // D Minor Melodic
  'd-sharp-minor-melodic': 51, // D# Minor Melodic
  'e-flat-minor-melodic': 51, // Eb Minor Melodic (enharmonic with D#)
  'e-minor-melodic': 52, // E Minor Melodic
  'f-minor-melodic': 53, // F Minor Melodic
  'f-sharp-minor-melodic': 54, // F# Minor Melodic
  'g-minor-melodic': 55, // G Minor Melodic
  'g-sharp-minor-melodic': 56, // G# Minor Melodic
  'a-flat-minor-melodic': 56, // Ab Minor Melodic (enharmonic with G#)
  'a-minor-melodic': 57, // A Minor Melodic
  'a-sharp-minor-melodic': 58, // A# Minor Melodic
  'b-flat-minor-melodic': 58, // Bb Minor Melodic (enharmonic with A#)
  'b-minor-melodic': 59, // B Minor Melodic
} as const

/**
 * Scale note names for generating proper labels
 */
const SCALE_NOTE_NAMES = {
  // Major scales
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
  // Minor natural scales
  'c-minor-natural': 'C',
  'c-sharp-minor-natural': 'C#',
  'd-minor-natural': 'D',
  'd-sharp-minor-natural': 'D#',
  'e-flat-minor-natural': 'Eb',
  'e-minor-natural': 'E',
  'f-minor-natural': 'F',
  'f-sharp-minor-natural': 'F#',
  'g-minor-natural': 'G',
  'g-sharp-minor-natural': 'G#',
  'a-flat-minor-natural': 'Ab',
  'a-minor-natural': 'A',
  'a-sharp-minor-natural': 'A#',
  'b-flat-minor-natural': 'Bb',
  'b-minor-natural': 'B',
  // Minor melodic scales
  'c-minor-melodic': 'C',
  'c-sharp-minor-melodic': 'C#',
  'd-minor-melodic': 'D',
  'd-sharp-minor-melodic': 'D#',
  'e-flat-minor-melodic': 'Eb',
  'e-minor-melodic': 'E',
  'f-minor-melodic': 'F',
  'f-sharp-minor-melodic': 'F#',
  'g-minor-melodic': 'G',
  'g-sharp-minor-melodic': 'G#',
  'a-flat-minor-melodic': 'Ab',
  'a-minor-melodic': 'A',
  'a-sharp-minor-melodic': 'A#',
  'b-flat-minor-melodic': 'Bb',
  'b-minor-melodic': 'B',
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
 * Creates a minor natural scale using exact MIDI numbers from the original implementation
 */
function createMinorNaturalScaleFromMidi(scaleId: string): ScaleType {
  const midiStart =
    MINOR_NATURAL_SCALE_MIDI_ROOTS[
      scaleId as keyof typeof MINOR_NATURAL_SCALE_MIDI_ROOTS
    ]
  const scaleName = SCALE_NOTE_NAMES[scaleId as keyof typeof SCALE_NOTE_NAMES]

  // Minor natural scale pattern: W-H-W-W-H-W-W
  const intervals = [0, 2, 3, 5, 7, 8, 10, 12]
  const romanNumerals = ['i', 'iiº', 'III', 'iv', 'v', 'VI', 'VII', 'i']

  const keys: ScaleKeyType = {}

  intervals.forEach((interval, index) => {
    const midiNote = midiStart + interval
    keys[midiNote] = romanNumerals[index]
  })

  return {
    label: `${scaleName} Minor (Natural)`,
    value: scaleId as AvailableAllScalesType,
    keys,
  }
}
/**
 * Creates a minor melodic scale using exact MIDI numbers from the original implementation
 */
function createMinorMelodicScaleFromMidi(scaleId: string): ScaleType {
  const midiStart =
    MINOR_MELODIC_SCALE_MIDI_ROOTS[
      scaleId as keyof typeof MINOR_MELODIC_SCALE_MIDI_ROOTS
    ]
  const scaleName = SCALE_NOTE_NAMES[scaleId as keyof typeof SCALE_NOTE_NAMES]

  // Minor melodic scale pattern: W-H-W-W-W-W-H
  const intervals = [0, 2, 3, 5, 7, 9, 11, 12]
  const romanNumerals = ['i', 'iiº', 'III+', 'IV', 'V', 'viº', 'viiº', 'i']

  const keys: ScaleKeyType = {}

  intervals.forEach((interval, index) => {
    const midiNote = midiStart + interval
    keys[midiNote] = romanNumerals[index]
  })

  return {
    label: `${scaleName} Minor (Melodic)`,
    value: scaleId as AvailableAllScalesType,
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
 * Generate all minor natural scales dynamically using the exact MIDI mappings
 */
export function generateAllMinorNaturalScales(): Record<string, ScaleType> {
  const scales: Record<string, ScaleType> = {}

  for (const scaleId of Object.keys(MINOR_NATURAL_SCALE_MIDI_ROOTS)) {
    scales[scaleId] = createMinorNaturalScaleFromMidi(scaleId)
  }

  return scales
}

/**
 * Generate all minor melodic scales dynamically using the exact MIDI mappings
 */
export function generateAllMinorMelodicScales(): Record<string, ScaleType> {
  const scales: Record<string, ScaleType> = {}

  for (const scaleId of Object.keys(MINOR_MELODIC_SCALE_MIDI_ROOTS)) {
    scales[scaleId] = createMinorMelodicScaleFromMidi(scaleId)
  }

  return scales
}

/**
 * Get a specific major scale by its identifier
 */
export function getMajorScale(scaleId: AvailableMajorScalesType): ScaleType {
  return createMajorScaleFromMidi(scaleId)
}

/**
 * Get a specific minor natural scale by its identifier
 */
export function getMinorNaturalScale(scaleId: string): ScaleType {
  return createMinorNaturalScaleFromMidi(scaleId)
}

/**
 * Get a specific minor melodic scale by its identifier
 */
export function getMinorMelodicScale(scaleId: string): ScaleType {
  return createMinorMelodicScaleFromMidi(scaleId)
}

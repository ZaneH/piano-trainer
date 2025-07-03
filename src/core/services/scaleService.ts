/**
 * Scale service for creating and manipulating scales
 */
import {
  MajorMinorType,
  ScaleType,
  AvailableAllScalesType,
  ScaleKeyType,
  AvailableMajorScalesType,
} from '../models/types'

const SCALE_LENGTH = 8
const OCTAVE_LENGTH = 12
const SCALE_STEP_VALUES = { w: 2, h: 1 } as const
const SCALE_STEPS = {
  Major: ['w', 'w', 'h', 'w', 'w', 'w', 'h'],
} as const

/**
 * Major scale root notes with their exact MIDI numbers
 */
const MAJOR_SCALE_MIDI_ROOTS = {
  'c-flat-major': 59,
  'c-major': 48,
  'c-sharp-major': 49,
  'd-major': 50,
  'e-flat-major': 51,
  'e-major': 52,
  'f-major': 53,
  'f-sharp-major': 54,
  'g-flat-major': 54, // Gb Major (enharmonic with F#)
  'g-major': 55,
  'a-flat-major': 56,
  'a-major': 57,
  'b-flat-major': 58,
  'b-major': 59,
} as const

/**
 * Minor natural scale root notes with their MIDI numbers
 */
const MINOR_NATURAL_SCALE_MIDI_ROOTS = {
  'c-minor-natural': 48,
  'c-sharp-minor-natural': 49,
  'd-minor-natural': 50,
  'd-sharp-minor-natural': 51,
  'e-flat-minor-natural': 51, // Eb Minor Natural (enharmonic with D#)
  'e-minor-natural': 52,
  'f-minor-natural': 53,
  'f-sharp-minor-natural': 54,
  'g-minor-natural': 55,
  'g-sharp-minor-natural': 56,
  'a-flat-minor-natural': 56, // Ab Minor Natural (enharmonic with G#)
  'a-minor-natural': 57,
  'a-sharp-minor-natural': 58,
  'b-flat-minor-natural': 58, // Bb Minor Natural (enharmonic with A#)
  'b-minor-natural': 59,
} as const

/**
 * Minor melodic scale root notes with their MIDI numbers from the original hardcoded scales
 */
const MINOR_MELODIC_SCALE_MIDI_ROOTS = {
  'c-minor-melodic': 48,
  'c-sharp-minor-melodic': 49,
  'd-minor-melodic': 50,
  'd-sharp-minor-melodic': 51,
  'e-flat-minor-melodic': 51, // Eb Minor Melodic (enharmonic with D#)
  'e-minor-melodic': 52,
  'f-minor-melodic': 53,
  'f-sharp-minor-melodic': 54,
  'g-minor-melodic': 55,
  'g-sharp-minor-melodic': 56,
  'a-flat-minor-melodic': 56, // Ab Minor Melodic (enharmonic with G#)
  'a-minor-melodic': 57,
  'a-sharp-minor-melodic': 58,
  'b-flat-minor-melodic': 58, // Bb Minor Melodic (enharmonic with A#)
  'b-minor-melodic': 59,
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

export function generateAllMinorNaturalScales(): Record<string, ScaleType> {
  const scales: Record<string, ScaleType> = {}

  for (const scaleId of Object.keys(MINOR_NATURAL_SCALE_MIDI_ROOTS)) {
    scales[scaleId] = createMinorNaturalScaleFromMidi(scaleId)
  }

  return scales
}

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

/**
 * Instead of duplicating d-flat-major and c-sharp-major (etc.) as keys
 * we'll use this function to convert unsupported keys to supported keys
 * @param key A potential match for AvailableAllScalesType key
 */
function swapKeyWithSynonym(key: string): AvailableAllScalesType {
  switch (key) {
    case 'd-flat-major': {
      return 'c-sharp-major'
    }
    case 'c-flat-major': {
      return 'b-major'
    }
    case 'd-sharp-major': {
      return 'e-flat-major'
    }
    case 'f-sharp-major':
    case 'g-flat-major':
    default: {
      return key as AvailableAllScalesType
    }
  }
}

/**
 * Given a MIDI number, calculate the previous fifth on the keyboard
 * and the next fifth as MIDI numbers.
 * @param midiNumber Get the fifths from this midi number
 * @param scale The fifths will fall in this key
 * @returns An array with 2 fifths as midi numbers
 */
export function getBothFifthsFromMidiNumber(
  midiNumber: number,
  scale: AvailableAllScalesType,
  availableScales: { [key in AvailableAllScalesType]: ScaleType }
): number[] {
  const safeScale = swapKeyWithSynonym(scale)
  try {
    const slicedKeys = Object.keys(availableScales[safeScale].keys)
    slicedKeys.slice(-1, 1)
    const currentNoteIdx = slicedKeys.indexOf(midiNumber.toString())
    let futureFifth = Number(
      slicedKeys[(currentNoteIdx + SCALE_LENGTH / 2) % slicedKeys.length]
    )
    let pastFifth = Number(
      slicedKeys.reverse()[
        (currentNoteIdx + SCALE_LENGTH / 2) % slicedKeys.length
      ]
    )

    return [pastFifth, futureFifth]
  } catch (e) {
    console.error('Likely missing a scale with key', scale)
    return []
  }
}

/**
 * Given a midi number, return another midi number that's a fifth away.
 * @param midiNumber A midi number to get the fifth of
 * @param scale The scale to follow for this fifth
 * @returns A single midi number that is a fifth from the given midi number
 */
export function getFifthFromMidiNumber(
  midiNumber: number,
  scale: AvailableAllScalesType,
  availableScales: { [key in AvailableAllScalesType]: ScaleType }
): number {
  const safeScale = swapKeyWithSynonym(scale)
  const slicedKeys = Object.keys(availableScales[safeScale].keys)
  const currentNoteIdx = slicedKeys.indexOf(midiNumber.toString())

  if (currentNoteIdx === -1) {
    // If the note isn't found in the scale, return the original note
    return midiNumber
  }

  // Calculate the 5th degree of the scale (4 steps ahead in 0-indexed array)
  let futureFifth = Number(
    slicedKeys[(currentNoteIdx + SCALE_LENGTH / 2) % slicedKeys.length]
  )

  // If the fifth is lower than the original note, we need to adjust octave
  if (midiNumber > futureFifth) {
    if (scale.includes('major')) {
      futureFifth += OCTAVE_LENGTH
    } else if (scale.includes('minor')) {
      futureFifth += OCTAVE_LENGTH
    }
  }

  return futureFifth
}

/**
 * Given the note in plain text, create a valid key for our Scales object
 * @param note The plain string of the key ex. 'c', 'Bb', 'G'
 * @param majMin (Optional) To determine which scale is used
 */
export function convertKeyToScalesKey(
  note: string,
  majMin: MajorMinorType = 'Major'
): AvailableAllScalesType {
  // Regex matches c#, C#, bb -- not BB, Abb, z
  const regexMatches = note.toLowerCase().match(/^([A-G]|[a-g])(#|b)?$/)
  if (!regexMatches) {
    console.error(
      'Invalid note given to convertKeyToScalesKey. Defaulting to C Major.'
    )
    return 'c-major'
  } else {
    let outputKey = regexMatches[1] // First regex group
    switch (regexMatches[2]) {
      case '#': {
        outputKey += '-sharp'
        break
      }
      case 'b': {
        outputKey += '-flat'
        break
      }
      default: {
        break
      }
    }

    if (majMin === 'Minor') {
      outputKey += `-${majMin.toLowerCase()}-natural`
    } else {
      outputKey += `-${majMin.toLowerCase()}`
    }

    return outputKey as AvailableAllScalesType
  }
}

const _availableScales = {
  ...generateAllMajorScales(),
  ...generateAllMinorNaturalScales(),
  ...generateAllMinorMelodicScales(),
}

export const AVAILABLE_SCALES = _availableScales as {
  [key in AvailableAllScalesType]: ScaleType
}

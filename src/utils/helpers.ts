import {
  AvailableAllScalesType,
  AVAILABLE_SCALES,
  CIRCLE_OF_FIFTHS,
  OCTAVE_LENGTH,
  ScaleKeyType,
  ScaleStepsType,
  ScaleType,
  SCALE_LENGTH,
  SCALE_STEPS,
  SCALE_STEP_VALUES,
} from '.'
import { MajorMinorType } from '../components/Quiz/Questions'
import { MidiNumbers } from 'react-piano'

/**
 * Returns the keys for a given `ScaleType` starting at c0 in midi numbers.
 * @param scale A `ScaleType` including the keys to ignore  the octave of
 * @returns An array of objects with midi numbers as key and their roman numerals as value
 */
export const ignoreOctave = (scale: ScaleType): ScaleKeyType[] => {
  const scaleKeys: string[] = Object.keys(scale.keys || {})
  const moduloKeys: ScaleKeyType[] = []

  for (const k of scaleKeys) {
    moduloKeys.push({
      [Number(k) % OCTAVE_LENGTH]: scale.keys[Number(k)],
    })
  }

  return moduloKeys
}

/**
 * Given a MIDI number, calculate the previous fifth on the keyboard
 * and the next fifth as MIDI numbers.
 * @param midiNumber Get the fifths from this midi number
 * @param scale The fifths will fall in this key
 * @returns An array with 2 fifths as midi numbers
 */
export const getBothFifthsFromMidiNumber = (
  midiNumber: number,
  scale: AvailableAllScalesType
): number[] => {
  const safeScale = swapKeyWithSynonym(scale)
  try {
    const slicedKeys = Object.keys(AVAILABLE_SCALES[safeScale].keys)
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
 * Given the note in plain text, create a valid key for our Scales object
 * @param note The plain string of the key ex. 'c', 'Bb', 'G'
 * @param majMin (Optional) To determine which scale is used
 */
export const convertKeyToScalesKey = (
  note: string,
  majMin: MajorMinorType = 'Major'
): AvailableAllScalesType => {
  // regex matches c#, C#, bb -- not BB, Abb, z
  const regexMatches = note.toLowerCase().match(/^([A-G]|[a-g])(#|b)?$/)
  if (!regexMatches) {
    console.error(
      'Invalid note given to convertKeyToScalesKey. Defaulting to C Major.'
    )
    return 'c-major'
  } else {
    let outputKey = regexMatches[1] // first regex group
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

/**
 * Instead of duplicating d-flat-major and c-sharp-major (etc.) as keys
 * we'll use this function to convert unsupported keys to supported keys
 * @param key A potential match for AvailableAllScalesType key
 */
const swapKeyWithSynonym = (key: string): AvailableAllScalesType => {
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
 * Given a midi number, return three midi numbers that make up a chord with the
 * provided scale.
 * @param midiNumber A midi number to start the triad from
 * @param scale The scale to follow for this chord
 * @returns 3 midi numbers in an array that make up a triad starting from midiNumber
 */
export const getTriadChordFromMidiNumber = (
  midiNumber: number,
  scale: ScaleType
): number[] => {
  const scaleKeys = Object.keys(scale.keys)
  const firstFingerIdx = scaleKeys.indexOf(midiNumber.toString())
  const firstFinger = Number(scaleKeys[firstFingerIdx])
  let secondFinger: number
  let thirdFinger: number
  const triadChordMidi: number[] = []

  if (firstFingerIdx < 0) {
    return triadChordMidi
  } else {
    secondFinger = Number(scaleKeys[(firstFingerIdx + 2) % (SCALE_LENGTH - 1)])
    const secondFingerIdx = scaleKeys.indexOf(secondFinger.toString())
    thirdFinger = Number(scaleKeys[(secondFingerIdx + 2) % (SCALE_LENGTH - 1)])
  }

  if (secondFinger < firstFinger) {
    secondFinger += OCTAVE_LENGTH
  }

  if (thirdFinger < secondFinger) {
    thirdFinger += OCTAVE_LENGTH
  }

  triadChordMidi.push(firstFinger, secondFinger, thirdFinger)

  return triadChordMidi
}

/**
 * Given a midi number, return four midi numbers that make up a seventh chord with the
 * provided scale.
 * @param midiNumber A midi number to start the seventh chord from
 * @param scale The scale to follow for this chord
 * @returns 4 midi numbers in an array that make up a seventh chord starting from midiNumber
 */
export const getSeventhChordFromMidiNumber = (
  midiNumber: number,
  scale: ScaleType
): number[] => {
  const scaleKeys = Object.keys(scale.keys)
  const firstFingerIdx = scaleKeys.indexOf(midiNumber.toString())
  const firstFinger = Number(scaleKeys[firstFingerIdx])
  let secondFinger: number
  let thirdFinger: number
  let fourthFinger: number
  const seventhChordMidi: number[] = []

  if (firstFingerIdx < 0) {
    return seventhChordMidi
  } else {
    secondFinger = Number(scaleKeys[(firstFingerIdx + 2) % (SCALE_LENGTH - 1)])
    const secondFingerIdx = scaleKeys.indexOf(secondFinger.toString())
    thirdFinger = Number(scaleKeys[(secondFingerIdx + 2) % (SCALE_LENGTH - 1)])
    const thirdFingerIdx = scaleKeys.indexOf(thirdFinger.toString())
    fourthFinger = Number(scaleKeys[(thirdFingerIdx + 2) % (SCALE_LENGTH - 1)])
  }

  if (secondFinger < firstFinger) {
    secondFinger += OCTAVE_LENGTH
  }

  if (thirdFinger < secondFinger) {
    thirdFinger += OCTAVE_LENGTH
  }

  if (fourthFinger < thirdFinger) {
    fourthFinger += OCTAVE_LENGTH
  }

  seventhChordMidi.push(firstFinger, secondFinger, thirdFinger, fourthFinger)

  return seventhChordMidi
}

/**
 * Given a midi number, return another midi number that's a fifth away.
 * @param midiNumber A midi number to get the fifth of
 * @param scale The scale to follow for this fifth
 * @returns A single midi number that is a fifth from the given midi number
 */
export const getFifthFromMidiNumber = (
  midiNumber: number,
  scale: AvailableAllScalesType
): number => {
  const safeScale = swapKeyWithSynonym(scale)
  const slicedKeys = Object.keys(AVAILABLE_SCALES[safeScale].keys)
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
      futureFifth +=
        SCALE_STEP_VALUES[
          SCALE_STEPS['Major'][currentNoteIdx] as ScaleStepsType
        ] + OCTAVE_LENGTH
    } else if (scale.includes('minor')) {
      futureFifth +=
        SCALE_STEP_VALUES[
          SCALE_STEPS['Minor'][currentNoteIdx] as ScaleStepsType
        ] + OCTAVE_LENGTH
    }
  }

  return futureFifth
}

/**
 * Returns a random piano note as a string.
 * @returns A random note (ex. C#, Db, F#, Gb)
 */
export const getRandomKey = (): string => {
  const allKeys = 'ABCDEFG'
  const allMods = ['', '#', 'b']
  let potentialKey = ''

  while (
    potentialKey === 'E#' ||
    potentialKey === 'B#' ||
    potentialKey === 'Fb' ||
    potentialKey === ''
  ) {
    potentialKey = `${allKeys[Math.floor(Math.random() * allKeys.length)]}${
      allMods[Math.floor(Math.random() * allMods.length)]
    }`
  }

  return potentialKey
}

/**
 * Helper function to generate a random `MajorMinorType` value.
 * @returns Either 'Major' or 'Minor'
 */
export const getRandomMajMin = (): MajorMinorType => {
  const options: MajorMinorType[] = ['Minor', 'Major']
  return options[Math.floor(Math.random() * options.length)]
}

/**
 * Helper function to generate a random note that will be on the Circle of Fifths.
 * @param majMin Which scale to use to generate a random fifth note (unnecessary?)
 * @returns A random note that's on the Circle of Fifths (ex. C, A, E, F#, etc.)
 */
export const getRandomFifth = (majMin: MajorMinorType) => {
  const fifths = CIRCLE_OF_FIFTHS[majMin]
  return fifths[Math.floor(Math.random() * fifths.length)]
}

/**
 * Helper function to shuffle an array.
 * @param array An array to shuffle
 * @returns A shuffled array
 */
export function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,
    randomIndex

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }

  return array
}

/**
 * Converts a given midi number to it's corresponding letter form. (ex. 48 = C)
 * @param midiNumber A midi number to convert to a note
 * @returns A note represented as a string without the octave.
 */
export const midiNumberToNote = (midiNumber: number): string => {
  return MidiNumbers.getAttributes(midiNumber)
    .note.toLowerCase()
    .replace(/[0-9]/, '')
}

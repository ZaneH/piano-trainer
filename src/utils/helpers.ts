import {
  AvailableAllScalesType,
  AVAILABLE_SCALES,
  CIRCLE_OF_FIFTHS,
  OCTAVE_LENGTH,
  ScaleStepsType,
  ScaleType,
  SCALE_LENGTH,
  SCALE_STEPS,
  SCALE_STEP_VALUES,
} from '.'
import { MajorMinorType } from '../components/Quiz/Questions'

export const ignoreOctave = (scale: ScaleType): ScaleType => {
  const scaleKeys: string[] = Object.keys(scale.keys || {})
  const modKeys: ScaleType = { keys: {} }

  for (const k of scaleKeys) {
    modKeys.keys[Number(k) % OCTAVE_LENGTH] = scale!.keys![Number(k)]
  }

  return modKeys
}

export const getFifthFromMidiNote = (
  midiNumber: number,
  scale: AvailableAllScalesType
): number => {
  const slicedKeys = Object.keys(AVAILABLE_SCALES[scale].keys)
  slicedKeys.slice(-1, 1)
  const currentNoteIdx = slicedKeys.indexOf(midiNumber.toString())
  let futureFifth = Number(
    slicedKeys[(currentNoteIdx + SCALE_LENGTH / 2) % slicedKeys.length]
  )
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
 * Given a MIDI number, calculate the previous fifth on the keyboard
 * and the next fifth as MIDI numbers.
 * @param midiNumber Get the fifths from this midi number
 * @param scale The fifths will fall in this key
 * @returns An array with 2 fifths as midi numbers
 */
export const getBothFifthsFromMidiNote = (
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
 * Certain keys are only in the circle of fifths as their synonym.
 * This replaces any potential "wrong" notes looked up in the CIRCLE_OF_FIFTHS
 * @param key A potential "wrong" key (ex. c#, f#, Db)
 * @param majMin Minor or major circle of fifths?
 */
export const swapNoteWithSynonym = (
  key: string,
  majMin: MajorMinorType
): string => {
  if (majMin === 'Major') {
    switch (key.toLowerCase()) {
      case 'db': {
        return 'c#'
      }
      case 'cb': {
        return 'b'
      }
      case 'd#': {
        return 'eb'
      }
      case 'f#':
      case 'gb':
      default: {
        return key.toLowerCase()
      }
    }
  } else {
    return key.toLowerCase()
  }
}

export const getTriadChordFromMidiNote = (
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

export const getRandomKey = () => {
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

export const getRandomMajMin = (): MajorMinorType => {
  const options: MajorMinorType[] = ['Minor', 'Major']
  return options[Math.floor(Math.random() * options.length)]
}

export const getRandomFifth = (majMin: MajorMinorType) => {
  const fifths = CIRCLE_OF_FIFTHS[majMin]
  return fifths[Math.floor(Math.random() * fifths.length)]
}

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

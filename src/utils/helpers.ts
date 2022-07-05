import {
  OCTAVE_LENGTH,
  ScaleType,
  SCALE_LENGTH,
  CIRCLE_OF_FIFTHS,
  SCALE_STEPS,
  SCALE_STEP_VALUES,
  ScaleStepsType,
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
  scale: ScaleType
): number[] => {
  const slicedKeys = Object.keys(scale.keys)
  slicedKeys.slice(-1, 1)
  const currentNoteIdx = slicedKeys.indexOf(midiNumber.toString())
  let futureFifth = Number(slicedKeys[(currentNoteIdx + 4) % slicedKeys.length])
  if (midiNumber > futureFifth) {
    if (scale.value?.includes('major')) {
      futureFifth +=
        SCALE_STEP_VALUES[
          SCALE_STEPS['Major'][currentNoteIdx] as ScaleStepsType
        ] + OCTAVE_LENGTH
    } else if (scale.value?.includes('minor')) {
      futureFifth +=
        SCALE_STEP_VALUES[
          SCALE_STEPS['Minor'][currentNoteIdx] as ScaleStepsType
        ] + OCTAVE_LENGTH
    }
  }
  return [midiNumber, futureFifth]
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
  return `${allKeys[Math.floor(Math.random() * allKeys.length)]}${
    allMods[Math.floor(Math.random() * allMods.length)]
  }`
}

export const getRandomMajMin = (): MajorMinorType => {
  const options: MajorMinorType[] = ['Minor', 'Major']
  return options[Math.floor(Math.random() * options.length)]
}

export const getRandomFifth = (majMin: MajorMinorType) => {
  const fifths = CIRCLE_OF_FIFTHS[majMin]
  return fifths[Math.floor(Math.random() * fifths.length)]
}

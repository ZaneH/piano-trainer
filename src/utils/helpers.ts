import { OCTAVE_LENGTH, ScaleType, SCALE_LENGTH } from '.'

export const ignoreOctave = (scale: ScaleType): ScaleType => {
  const scaleKeys: string[] = Object.keys(scale.keys || {})
  const modKeys: ScaleType = { keys: {} }

  for (const k of scaleKeys) {
    modKeys.keys[Number(k) % OCTAVE_LENGTH] = scale!.keys![Number(k)]
  }

  return modKeys
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

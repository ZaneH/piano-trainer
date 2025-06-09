/**
 * Chord service for manipulating chords
 */
import { MidiNumber, ScaleType } from '../models/types'
import { OCTAVE_LENGTH, SCALE_LENGTH } from '../models/constants'
import { midiNumberToNote } from './noteService'

/**
 * Gets the triad chord (three notes) starting from a midi number
 */
export function getTriadChord(
  midiNumber: MidiNumber,
  scale: ScaleType
): MidiNumber[] {
  const scaleKeys = Object.keys(scale.keys)
  const firstFingerIdx = scaleKeys.indexOf(midiNumber.toString())
  const firstFinger = Number(scaleKeys[firstFingerIdx])
  const chordNotes: MidiNumber[] = []

  if (firstFingerIdx < 0) {
    return chordNotes
  }

  // Find second and third fingers (chord notes)
  let secondFinger = Number(
    scaleKeys[(firstFingerIdx + 2) % (SCALE_LENGTH - 1)]
  )
  const secondFingerIdx = scaleKeys.indexOf(secondFinger.toString())
  let thirdFinger = Number(
    scaleKeys[(secondFingerIdx + 2) % (SCALE_LENGTH - 1)]
  )

  // Adjust octaves if needed
  if (secondFinger < firstFinger) {
    secondFinger += OCTAVE_LENGTH
  }

  if (thirdFinger < secondFinger) {
    thirdFinger += OCTAVE_LENGTH
  }

  chordNotes.push(firstFinger, secondFinger, thirdFinger)
  return chordNotes
}

/**
 * Gets the seventh chord (four notes) starting from a midi number
 */
export function getSeventhChord(
  midiNumber: MidiNumber,
  scale: ScaleType
): MidiNumber[] {
  const scaleKeys = Object.keys(scale.keys)
  const firstFingerIdx = scaleKeys.indexOf(midiNumber.toString())
  const firstFinger = Number(scaleKeys[firstFingerIdx])
  const chordNotes: MidiNumber[] = []

  if (firstFingerIdx < 0) {
    return chordNotes
  }

  // Find second, third, and fourth fingers (chord notes)
  let secondFinger = Number(
    scaleKeys[(firstFingerIdx + 2) % (SCALE_LENGTH - 1)]
  )
  const secondFingerIdx = scaleKeys.indexOf(secondFinger.toString())
  let thirdFinger = Number(
    scaleKeys[(secondFingerIdx + 2) % (SCALE_LENGTH - 1)]
  )
  const thirdFingerIdx = scaleKeys.indexOf(thirdFinger.toString())
  let fourthFinger = Number(
    scaleKeys[(thirdFingerIdx + 2) % (SCALE_LENGTH - 1)]
  )

  // Adjust octaves if needed
  if (secondFinger < firstFinger) {
    secondFinger += OCTAVE_LENGTH
  }

  if (thirdFinger < secondFinger) {
    thirdFinger += OCTAVE_LENGTH
  }

  if (fourthFinger < thirdFinger) {
    fourthFinger += OCTAVE_LENGTH
  }

  chordNotes.push(firstFinger, secondFinger, thirdFinger, fourthFinger)
  return chordNotes
}

/**
 * Note service for converting between notes and MIDI numbers
 */
import { MidiNumbers } from 'react-piano'
import { CIRCLE_OF_FIFTHS, OCTAVE_LENGTH } from '../models/constants'
import { MajorMinorType, MidiNumber, Note } from '../models/types'

/**
 * Converts a MIDI number to a note name without octave
 */
export function midiNumberToNote(midiNumber: MidiNumber): Note {
  return MidiNumbers.getAttributes(midiNumber)
    .note.toLowerCase()
    .replace(/[0-9]/, '')
}

/**
 * Normalizes a note name by swapping with its synonym where necessary
 */
export function normalizeNoteName(noteName: Note): Note {
  // Swap note synonyms
  switch (noteName.toLowerCase()) {
    case 'db':
      return 'c#'
    case 'eb':
      return 'd#'
    case 'gb':
      return 'f#'
    case 'ab':
      return 'g#'
    case 'bb':
      return 'a#'
    // Theoretical enharmonics
    case 'cb':
      return 'b'
    case 'e#':
      return 'f'
    case 'b#':
      return 'c'
    case 'fb':
      return 'e'
    default:
      return noteName.toLowerCase()
  }
}

/**
 * Ignores octave information from MIDI numbers in a scale
 */
export function ignoreOctave(
  midiNumbers: Record<MidiNumber, string>
): Record<number, string>[] {
  const result: Record<number, string>[] = []

  for (const midiNumber of Object.keys(midiNumbers).map(Number)) {
    result.push({
      [midiNumber % OCTAVE_LENGTH]: midiNumbers[midiNumber],
    })
  }

  return result
}

/**
 * Returns a random piano note as a string.
 * @returns A random note (ex. C#, Db, F#, Gb)
 */
export function getRandomKey(): string {
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
export function getRandomMajMin(): MajorMinorType {
  const options: MajorMinorType[] = ['Minor', 'Major']
  return options[Math.floor(Math.random() * options.length)]
}

/**
 * Helper function to generate a random note that will be on the Circle of Fifths.
 * @param majMin Which scale to use to generate a random fifth note
 * @returns A random note that's on the Circle of Fifths (ex. C, A, E, F#, etc.)
 */
export function getRandomFifth(): string {
  const fifths = CIRCLE_OF_FIFTHS
  return fifths[Math.floor(Math.random() * fifths.length)]
}

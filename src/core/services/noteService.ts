/**
 * Note service for converting between notes and MIDI numbers
 */
import { MidiNumbers } from 'react-piano'
import { MidiNumber, Note, AvailableAllScalesType } from '../models/types'
import { OCTAVE_LENGTH } from '../models/constants'

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

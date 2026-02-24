/**
 * Custom hook for piano keyboard interactions
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTrainer } from '../contexts/TrainerContext'
import { MidiNumber } from '../models/types'
import { getSeventhChord, getTriadChord } from '../services/chordService'
import { midiNumberToNote } from '../services/noteService'
import {
  AVAILABLE_SCALES,
  getFifthFromMidiNumber,
} from '../services/scaleService'

interface UsePianoKeyboardProps {
  firstNote: MidiNumber
  lastNote: MidiNumber
}

export function findExactScaleMatch(
  chordStack: MidiNumber[],
  targetMidiNumber: MidiNumber
): MidiNumber | undefined {
  const exactMatch = chordStack.find((cs) => cs === targetMidiNumber)
  if (exactMatch !== undefined) {
    return exactMatch
  }

  const targetNote = midiNumberToNote(targetMidiNumber)
  return chordStack.find((cs) => midiNumberToNote(cs) === targetNote)
}

export function usePianoKeyboard({
  firstNote,
  lastNote,
}: UsePianoKeyboardProps) {
  const [activeNotes, setActiveNotes] = useState<Record<MidiNumber, boolean>>(
    {}
  )

  const lastProcessedNoteRef = useRef<number | null>(null)

  const {
    noteTracker,
    practiceMode,
    chordStack,
    addToChordStack,
    removeFromChordStack,
    clearChordStack,
    advanceNote,
    scale,
  } = useTrainer()

  // Handle note played
  const handlePlayNote = useCallback(
    (midiNumber: MidiNumber) => {
      // Only process if note is within valid range
      if (midiNumber < firstNote || midiNumber > lastNote) return

      // Add to active notes
      setActiveNotes((prev) => ({ ...prev, [midiNumber]: true }))

      // Add to chord stack
      addToChordStack(midiNumber)
    },
    [addToChordStack, firstNote, lastNote]
  )

  // Handle note released
  const handleStopNote = useCallback(
    (midiNumber: MidiNumber) => {
      // Only process if note is within valid range
      if (midiNumber < firstNote || midiNumber > lastNote) return

      // Remove from active notes
      setActiveNotes((prev) => ({ ...prev, [midiNumber]: false }))

      // Remove from chord stack
      removeFromChordStack(midiNumber)
    },
    [removeFromChordStack, firstNote, lastNote]
  )

  // Check if the current chord stack matches what we're looking for
  useEffect(() => {
    if (chordStack.length === 0) return

    const targetNote = noteTracker.nextTargetMidiNumber

    if (chordStack.includes(lastProcessedNoteRef.current || -1)) {
      // If the last processed note is already in the chord stack, skip processing
      return
    }

    if (practiceMode === 'scales') {
      // For scales, match by pitch class so any octave can progress.
      const matchingNote = findExactScaleMatch(
        chordStack,
        noteTracker.nextTargetMidiNumber
      )
      if (matchingNote !== undefined) {
        lastProcessedNoteRef.current = matchingNote
        advanceNote()
        clearChordStack()
      }
    } else if (practiceMode === 'chords') {
      // For chords, check if all required notes are played
      const targetChord = getTriadChord(
        noteTracker.nextTargetMidiNumber,
        scale!
      )

      // Turn the target numbers into target letters to ignore octave for matching
      const targetChordNotes = targetChord.map((n) => midiNumberToNote(n))

      // Check if all required notes are played
      const matches = targetChordNotes.every((note) =>
        chordStack.map((cs) => midiNumberToNote(cs)).includes(note)
      )

      if (matches) {
        // Find the first matching note in the chord stack to use as the last processed note
        const processedChordNote = chordStack.find((cs) =>
          targetChordNotes.includes(midiNumberToNote(cs))
        )
        lastProcessedNoteRef.current = processedChordNote || targetNote
        advanceNote()
        clearChordStack()
      }
    } else if (practiceMode === 'seventhChords') {
      // For seventh chords, check if all required notes are played
      const targetChord = getSeventhChord(
        noteTracker.nextTargetMidiNumber,
        scale!
      )

      // Turn the target numbers into target letters to ignore octave for matching
      const targetChordNotes = targetChord.map((n) => midiNumberToNote(n))

      // Check if all required notes are played
      const matches = targetChordNotes.every((note) =>
        chordStack.map((cs) => midiNumberToNote(cs)).includes(note)
      )

      if (matches) {
        // Find the first matching note in the chord stack to use as the last processed note
        const processedChordNote = chordStack.find((cs) =>
          targetChordNotes.includes(midiNumberToNote(cs))
        )
        lastProcessedNoteRef.current = processedChordNote || targetNote
        advanceNote()
        clearChordStack()
      }
    } else if (practiceMode === 'fifths') {
      // For fifths, check if both the root and fifth are played
      const targetFifths = [
        noteTracker.nextTargetMidiNumber,
        getFifthFromMidiNumber(
          noteTracker.nextTargetMidiNumber,
          scale?.value!,
          AVAILABLE_SCALES
        ),
      ]

      // Turn the target numbers into target letters to ignore octave for matching
      const targetFifthNotes = targetFifths.map((f) => midiNumberToNote(f))

      // Check if all required notes are played
      const matches = targetFifthNotes.every((note) =>
        chordStack.map((cs) => midiNumberToNote(cs)).includes(note)
      )

      if (matches) {
        // Find the first matching note in the chord stack to use as the last processed note
        const processedFifthNote = chordStack.find((cs) =>
          targetFifthNotes.includes(midiNumberToNote(cs))
        )
        lastProcessedNoteRef.current = processedFifthNote || targetNote
        advanceNote()
        clearChordStack()
      }
    }
  }, [
    chordStack,
    noteTracker.nextTargetMidiNumber,
    practiceMode,
    advanceNote,
    clearChordStack,
    scale,
  ])

  return {
    activeNotes,
    handlePlayNote,
    handleStopNote,
  }
}

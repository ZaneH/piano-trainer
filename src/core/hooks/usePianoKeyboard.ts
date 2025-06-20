/**
 * Custom hook for piano keyboard interactions
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { midiNumberToNote } from '../services/noteService'
import { useTrainer } from '../contexts/TrainerContext'
import { MidiNumber } from '../models/types'
import {
  getTriadChordFromMidiNumber,
  getSeventhChordFromMidiNumber,
  getFifthFromMidiNumber,
} from '../../utils'

interface UsePianoKeyboardProps {
  firstNote: MidiNumber
  lastNote: MidiNumber
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

    const currentNote = noteTracker.nextTargetMidiNumber
    if (lastProcessedNoteRef.current === currentNote) return

    const targetScaleNote = midiNumberToNote(noteTracker.nextTargetMidiNumber)

    if (practiceMode === 'scales') {
      // For scales, we just need to match a single note
      if (
        chordStack.map((cs) => midiNumberToNote(cs)).includes(targetScaleNote)
      ) {
        lastProcessedNoteRef.current = currentNote
        advanceNote()
        clearChordStack()
      }
    } else if (practiceMode === 'chords') {
      // For chords, check if all required notes are played
      const targetChord = getTriadChordFromMidiNumber(
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
        lastProcessedNoteRef.current = currentNote
        advanceNote()
        clearChordStack()
      }
    } else if (practiceMode === 'seventhChords') {
      // For seventh chords, check if all required notes are played
      const targetChord = getSeventhChordFromMidiNumber(
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
        lastProcessedNoteRef.current = currentNote
        advanceNote()
        clearChordStack()
      }
    } else if (practiceMode === 'fifths') {
      // For fifths, check if both the root and fifth are played
      const targetFifths = [
        noteTracker.nextTargetMidiNumber,
        getFifthFromMidiNumber(noteTracker.nextTargetMidiNumber, scale?.value!),
      ]

      // Turn the target numbers into target letters to ignore octave for matching
      const targetFifthNotes = targetFifths.map((f) => midiNumberToNote(f))

      // Check if all required notes are played
      const matches = targetFifthNotes.every((note) =>
        chordStack.map((cs) => midiNumberToNote(cs)).includes(note)
      )

      if (matches) {
        lastProcessedNoteRef.current = currentNote
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

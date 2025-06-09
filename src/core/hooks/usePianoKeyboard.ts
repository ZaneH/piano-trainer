/**
 * Custom hook for piano keyboard interactions
 */
import { useCallback, useEffect, useState } from 'react'
import { midiNumberToNote } from '../services/noteService'
import { useTrainer } from '../contexts/TrainerContext'
import { MidiNumber } from '../models/types'
import { useSettings } from '../contexts/SettingsContext'

interface UsePianoKeyboardProps {
  firstNote: MidiNumber
  lastNote: MidiNumber
  playNote?: (midiNumber: MidiNumber) => void
  stopNote?: (midiNumber: MidiNumber) => void
}

export function usePianoKeyboard({
  firstNote,
  lastNote,
  playNote,
  stopNote,
}: UsePianoKeyboardProps) {
  const [activeNotes, setActiveNotes] = useState<Record<MidiNumber, boolean>>(
    {}
  )
  const { muteSound } = useSettings()

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
      // Add to active notes
      setActiveNotes((prev) => ({ ...prev, [midiNumber]: true }))

      // Add to chord stack
      addToChordStack(midiNumber)

      // Play sound if not muted
      if (!muteSound && playNote) {
        playNote(midiNumber)
      }
    },
    [addToChordStack, muteSound, playNote]
  )

  // Handle note released
  const handleStopNote = useCallback(
    (midiNumber: MidiNumber) => {
      // Remove from active notes
      setActiveNotes((prev) => ({ ...prev, [midiNumber]: false }))

      // Remove from chord stack
      removeFromChordStack(midiNumber)

      // Stop sound
      if (stopNote) {
        stopNote(midiNumber)
      }
    },
    [removeFromChordStack, stopNote]
  )

  // Check if the current chord stack matches what we're looking for
  useEffect(() => {
    if (chordStack.length === 0) return

    const targetScaleNote = midiNumberToNote(noteTracker.nextTargetMidiNumber)

    if (practiceMode === 'scales') {
      // For scales, we just need to match a single note
      if (
        chordStack.map((cs) => midiNumberToNote(cs)).includes(targetScaleNote)
      ) {
        advanceNote()
        clearChordStack()
      }
    } else if (practiceMode === 'chords') {
      // For chords, check if all required notes are played
      // Implementation depends on your chord detection logic
    } else if (practiceMode === 'seventhChords') {
      // Similar implementation for seventh chords
    } else if (practiceMode === 'fifths') {
      // Similar implementation for fifths
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

/**
 * Hook for managing scales and note progression
 */
import { useState, useEffect, useCallback } from 'react'
import {
  AvailablePracticeModesType,
  NoteTracker,
  ScaleType,
} from '../models/types'
import { getTriadChord, getSeventhChord } from '../services/chordService'
import { getFifthFromMidiNumber } from '../services/noteService'

interface UseNoteProgressionProps {
  scale: ScaleType
  practiceMode: AvailablePracticeModesType
  isPingPongMode: boolean
  isHardMode: boolean
}

interface UseNoteProgressionResult {
  noteTracker: NoteTracker
  resetProgress: () => void
  advanceNote: () => void
  isCorrectNote: (midiNumber: number) => boolean
  getActiveNotes: () => number[]
}

export function useNoteProgression({
  scale,
  practiceMode,
  isPingPongMode,
  isHardMode,
}: UseNoteProgressionProps): UseNoteProgressionResult {
  const [noteTracker, setNoteTracker] = useState<NoteTracker>({
    currentMidiNumber: Number(Object.keys(scale.keys)[0]),
    nextTargetMidiNumber: Number(Object.keys(scale.keys)[0]),
    prevNote: Number(Object.keys(scale.keys)[0]),
    noteCounter: 0,
  })

  const [isGoingDown, setIsGoingDown] = useState(false)

  // Reset the progress when scale or modes change
  const resetProgress = useCallback(() => {
    const firstNote = Number(Object.keys(scale.keys)[0])
    setNoteTracker({
      currentMidiNumber: firstNote,
      nextTargetMidiNumber: firstNote,
      prevNote: firstNote,
      noteCounter: 0,
    })
    setIsGoingDown(false)
  }, [scale])

  // Determine the next note based on direction and mode
  useEffect(() => {
    const scaleKeys = Object.keys(scale.keys).map(Number)
    const scaleStartMidiNumber = scaleKeys[0]
    const scaleEndMidiNumber = scaleKeys[scaleKeys.length - 1]

    if (isPingPongMode && isGoingDown) {
      // Going down in ping-pong mode
      if (noteTracker.currentMidiNumber === scaleStartMidiNumber) {
        setIsGoingDown(false)
      } else {
        const nextIndex = scaleKeys.indexOf(noteTracker.currentMidiNumber) - 1
        setNoteTracker((prev) => ({
          ...prev,
          prevNote: prev.currentMidiNumber,
          nextTargetMidiNumber: scaleKeys[nextIndex],
        }))
      }
    } else {
      // Going up or regular mode
      if (noteTracker.currentMidiNumber === scaleEndMidiNumber) {
        if (isPingPongMode) {
          setIsGoingDown(true)
          const nextIndex = scaleKeys.indexOf(noteTracker.currentMidiNumber) - 1
          setNoteTracker((prev) => ({
            ...prev,
            prevNote: prev.currentMidiNumber,
            nextTargetMidiNumber: scaleKeys[nextIndex],
          }))
        } else {
          // Loop back to beginning
          setNoteTracker((prev) => ({
            ...prev,
            prevNote: isHardMode
              ? scaleStartMidiNumber
              : prev.currentMidiNumber,
            nextTargetMidiNumber: scaleStartMidiNumber,
          }))
        }
      } else {
        // Regular advance to next note
        const nextIndex =
          (scaleKeys.indexOf(noteTracker.currentMidiNumber) + 1) %
          scaleKeys.length
        setNoteTracker((prev) => ({
          ...prev,
          prevNote: prev.currentMidiNumber,
          nextTargetMidiNumber: scaleKeys[nextIndex],
        }))
      }
    }
  }, [
    noteTracker.currentMidiNumber,
    noteTracker.noteCounter,
    scale.keys,
    isPingPongMode,
    isHardMode,
    isGoingDown,
  ])

  // Advance to the next note
  const advanceNote = useCallback(() => {
    setNoteTracker((prev) => ({
      ...prev,
      noteCounter: prev.noteCounter + 1,
      currentMidiNumber: prev.nextTargetMidiNumber,
    }))
  }, [])

  // Check if a played note matches the expected next note
  const isCorrectNote = useCallback(
    (midiNumber: number): boolean => {
      if (practiceMode === 'scales') {
        return midiNumber === noteTracker.nextTargetMidiNumber
      } else if (practiceMode === 'chords') {
        const targetChord = getTriadChord(
          noteTracker.nextTargetMidiNumber,
          scale
        )
        return targetChord.includes(midiNumber)
      } else if (practiceMode === 'seventhChords') {
        const targetChord = getSeventhChord(
          noteTracker.nextTargetMidiNumber,
          scale
        )
        return targetChord.includes(midiNumber)
      } else if (practiceMode === 'fifths') {
        if (!scale.value) return false
        const targetFifths = [
          noteTracker.nextTargetMidiNumber,
          getFifthFromMidiNumber(noteTracker.nextTargetMidiNumber, scale.value),
        ]
        return targetFifths.includes(midiNumber)
      }
      return false
    },
    [noteTracker.nextTargetMidiNumber, practiceMode, scale]
  )

  // Get the active notes to display based on practice mode
  const getActiveNotes = useCallback((): number[] => {
    const targetNote = noteTracker.nextTargetMidiNumber

    if (isHardMode) {
      // In hard mode, highlight the previous note instead
      const prevNote = noteTracker.prevNote

      if (practiceMode === 'scales') {
        return prevNote ? [prevNote] : []
      } else if (practiceMode === 'chords') {
        return prevNote ? getTriadChord(prevNote, scale) : []
      } else if (practiceMode === 'seventhChords') {
        return prevNote ? getSeventhChord(prevNote, scale) : []
      } else if (practiceMode === 'fifths') {
        if (!prevNote || !scale.value) return []
        return [prevNote, getFifthFromMidiNumber(prevNote, scale.value)]
      }
    } else {
      // Normal mode - highlight the target note
      if (practiceMode === 'scales') {
        return [targetNote]
      } else if (practiceMode === 'chords') {
        return getTriadChord(targetNote, scale)
      } else if (practiceMode === 'seventhChords') {
        return getSeventhChord(targetNote, scale)
      } else if (practiceMode === 'fifths') {
        if (!scale.value) return []
        return [targetNote, getFifthFromMidiNumber(targetNote, scale.value)]
      }
    }

    return []
  }, [noteTracker, scale, practiceMode, isHardMode])

  // Reset when dependencies change
  useEffect(() => {
    resetProgress()
  }, [scale, isPingPongMode, practiceMode, isHardMode, resetProgress])

  return {
    noteTracker,
    resetProgress,
    advanceNote,
    isCorrectNote,
    getActiveNotes,
  }
}

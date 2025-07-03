/**
 * Provider component for the TrainerContext
 */
import { FC, ReactNode, useCallback, useState } from 'react'
import { TrainerContext } from '../contexts/TrainerContext'
import {
  AvailablePracticeModesType,
  AvailableScreensType,
  MidiNumber,
  ScaleType,
} from '../models/types'
import { useNoteProgression } from '../hooks/useNoteProgression'
import { AVAILABLE_SCALES } from '../services/scaleService'

interface TrainerProviderProps {
  children: ReactNode
  initialScale?: ScaleType
  initialPracticeMode?: AvailablePracticeModesType
  initialScreen?: AvailableScreensType
}

const TrainerProvider: FC<TrainerProviderProps> = ({
  children,
  initialScale = AVAILABLE_SCALES['c-major'],
  initialPracticeMode = 'scales',
  initialScreen = 'practice',
}) => {
  // State for scale and practice modes
  const [scale, setScale] = useState<ScaleType>(initialScale)
  const [practiceMode, setPracticeMode] =
    useState<AvailablePracticeModesType>(initialPracticeMode)
  const [currentScreen, setCurrentScreen] =
    useState<AvailableScreensType>(initialScreen)
  const [isScalePingPong, setIsScalePingPong] = useState(false)
  const [isHardModeEnabled, setIsHardModeEnabled] = useState(false)

  // State for currently played notes (chords)
  const [chordStack, setChordStack] = useState<MidiNumber[]>([])

  // Use the note progression hook
  const { noteTracker, advanceNote, resetProgress, getActiveNotes } =
    useNoteProgression({
      scale,
      practiceMode,
      isPingPongMode: isScalePingPong,
      isHardMode: isHardModeEnabled,
    })

  // Chord stack management
  const addToChordStack = useCallback((midiNumber: MidiNumber) => {
    setChordStack((prev) => [...prev, midiNumber])
  }, [])

  const removeFromChordStack = useCallback((midiNumber: MidiNumber) => {
    setChordStack((prev) => {
      const index = prev.indexOf(midiNumber)
      if (index > -1) {
        const newStack = [...prev]
        newStack.splice(index, 1)
        return newStack
      }
      return prev
    })
  }, [])

  const clearChordStack = useCallback(() => {
    setChordStack([])
  }, [])

  return (
    <TrainerContext.Provider
      value={{
        // Core state
        scale,
        setScale,
        noteTracker,
        chordStack,
        addToChordStack,
        removeFromChordStack,
        clearChordStack,

        // Navigation and settings
        practiceMode,
        setPracticeMode,
        currentScreen,
        setCurrentScreen,
        isScalePingPong,
        setIsScalePingPong,
        isHardModeEnabled,
        setIsHardModeEnabled,

        // Actions
        advanceNote,
        resetProgress,
        getActiveNotes,
      }}
    >
      {children}
    </TrainerContext.Provider>
  )
}

export default TrainerProvider

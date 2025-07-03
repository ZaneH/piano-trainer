import { createContext, useContext } from 'react'
import {
  AvailablePracticeModesType,
  AvailableScreensType,
  MidiNumber,
  NoteTracker,
  ScaleType,
} from '../models/types'

interface TrainerContextType {
  // Core functionality
  scale: ScaleType
  setScale: (scale: ScaleType) => void
  selectedScales: ScaleType[]
  setSelectedScales: (scales: ScaleType[]) => void
  noteTracker: NoteTracker
  chordStack: MidiNumber[]
  addToChordStack: (midiNumber: MidiNumber) => void
  removeFromChordStack: (midiNumber: MidiNumber) => void
  clearChordStack: () => void

  // Navigation and settings
  practiceMode: AvailablePracticeModesType
  setPracticeMode: (mode: AvailablePracticeModesType) => void
  currentScreen: AvailableScreensType
  setCurrentScreen: (screen: AvailableScreensType) => void

  // Features
  isScalePingPong: boolean
  setIsScalePingPong: (isPingPong: boolean) => void
  isHardModeEnabled: boolean
  setIsHardModeEnabled: (isHardMode: boolean) => void
  isShuffleModeEnabled: boolean
  setIsShuffleModeEnabled: (isShuffleMode: boolean) => void

  // Actions
  advanceNote: () => void
  resetProgress: () => void
  getActiveNotes: () => MidiNumber[]
}

export const TrainerContext = createContext<TrainerContextType | null>(null)

export function useTrainer(): TrainerContextType {
  const context = useContext(TrainerContext)
  if (!context) {
    throw new Error('useTrainer must be used within a TrainerProvider')
  }
  return context
}

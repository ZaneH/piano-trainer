import { renderHook } from '@testing-library/react'
import { useTrainer } from '../contexts/TrainerContext'
import { findExactScaleMatch, usePianoKeyboard } from './usePianoKeyboard'

jest.mock('../contexts/TrainerContext', () => ({
  useTrainer: jest.fn(),
}))

const mockUseTrainer = useTrainer as jest.MockedFunction<typeof useTrainer>

describe('usePianoKeyboard scale matching', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('matches exact target midi number', () => {
    expect(findExactScaleMatch([48, 52, 55, 60], 60)).toBe(60)
  })

  test('matches lower octave for target tonic', () => {
    expect(findExactScaleMatch([48], 60)).toBe(48)
  })

  test('matches upper octave for lower target tonic', () => {
    expect(findExactScaleMatch([60], 48)).toBe(60)
  })

  test('does not match different pitch class', () => {
    expect(findExactScaleMatch([61], 60)).toBeUndefined()
  })

  test('allows progression when a new octave tonic is pressed while the previous tonic is still held', () => {
    const addToChordStack = jest.fn()
    const removeFromChordStack = jest.fn()
    const clearChordStack = jest.fn()
    const advanceNote = jest.fn()

    const trainerState: any = {
      noteTracker: { nextTargetMidiNumber: 72 },
      practiceMode: 'scales',
      chordStack: [72],
      addToChordStack,
      removeFromChordStack,
      clearChordStack,
      advanceNote,
      scale: null,
    }

    mockUseTrainer.mockImplementation(() => trainerState)

    const { rerender } = renderHook(() =>
      usePianoKeyboard({
        firstNote: 36,
        lastNote: 96,
      })
    )

    expect(advanceNote).toHaveBeenCalledTimes(1)
    expect(clearChordStack).toHaveBeenCalledTimes(1)

    trainerState.noteTracker = { nextTargetMidiNumber: 60 }
    trainerState.chordStack = [72, 84]
    rerender()

    expect(advanceNote).toHaveBeenCalledTimes(2)
    expect(clearChordStack).toHaveBeenCalledTimes(2)
  })

  test('allows re-pressing the same tonic midi after wrap to the lower-octave tonic target', () => {
    const addToChordStack = jest.fn()
    const removeFromChordStack = jest.fn()
    const clearChordStack = jest.fn()
    const advanceNote = jest.fn()

    const trainerState: any = {
      noteTracker: { nextTargetMidiNumber: 72 },
      practiceMode: 'scales',
      chordStack: [72],
      addToChordStack,
      removeFromChordStack,
      clearChordStack,
      advanceNote,
      scale: null,
    }

    mockUseTrainer.mockImplementation(() => trainerState)

    const { rerender } = renderHook(() =>
      usePianoKeyboard({
        firstNote: 36,
        lastNote: 96,
      })
    )

    expect(advanceNote).toHaveBeenCalledTimes(1)
    expect(clearChordStack).toHaveBeenCalledTimes(1)

    // Scale wrapped back to the lower tonic target, user presses the same higher tonic key again.
    trainerState.noteTracker = { nextTargetMidiNumber: 60 }
    trainerState.chordStack = [72]
    rerender()

    expect(advanceNote).toHaveBeenCalledTimes(2)
    expect(clearChordStack).toHaveBeenCalledTimes(2)
  })
})

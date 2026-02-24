import { createEvent, fireEvent, render } from '@testing-library/react'
import Keyboard from './Keyboard'

const mockPlaySound = jest.fn()
const mockStopSound = jest.fn()
const mockHandlePlayNote = jest.fn()
const mockHandleStopNote = jest.fn()
const mockPiano = jest.fn()
let mockMidiActiveNotes: Record<number, boolean> = {}
let mockKeyboardActiveNotes: Record<number, boolean> = {}

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (value: string) => value }),
}))

jest.mock('../../core/contexts/SettingsContext', () => ({
  useSettings: () => ({
    muteSound: false,
    showKeyboard: true,
    midiDevice: null,
    pianoSound: 'acoustic_grand_piano',
  }),
}))

jest.mock('../../core/contexts/TrainerContext', () => ({
  useTrainer: () => ({
    addToChordStack: jest.fn(),
    removeFromChordStack: jest.fn(),
  }),
}))

jest.mock('../../core/hooks/useMidiDevices', () => ({
  useMidiDevices: () => ({
    activeNotes: mockMidiActiveNotes,
  }),
}))

jest.mock('../../core/hooks/usePianoKeyboard', () => ({
  usePianoKeyboard: () => ({
    activeNotes: mockKeyboardActiveNotes,
    handlePlayNote: mockHandlePlayNote,
    handleStopNote: mockHandleStopNote,
  }),
}))

jest.mock('../SoundfontProvider', () => ({
  __esModule: true,
  default: ({ render }: any) =>
    render({ playNote: mockPlaySound, stopNote: mockStopSound }),
}))

jest.mock('react-piano', () => ({
  MidiNumbers: {
    fromNote: (note: string) => {
      if (note === 'c2') return 36
      if (note === 'c3') return 48
      if (note === 'c5') return 72
      if (note === 'c6') return 84
      return 0
    },
    getAttributes: () => ({ note: 'C4' }),
  },
  KeyboardShortcuts: {
    HOME_ROW: [],
    create: () => [],
  },
  Piano: (props: any) => {
    mockPiano(props)
    const label = props.renderNoteLabel({
      midiNumber: 60,
      isAccidental: false,
    })
    return (
      <>
        <button data-testid='touch-key' onTouchStart={() => props.playNote(60)}>
          key
        </button>
        {label}
      </>
    )
  },
}))

describe('Keyboard touch behavior', () => {
  const originalInnerWidth = window.innerWidth

  const setInnerWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      writable: true,
      value: width,
    })
  }

  afterAll(() => {
    setInnerWidth(originalInnerWidth)
  })

  beforeEach(() => {
    setInnerWidth(1024)
    mockMidiActiveNotes = {}
    mockKeyboardActiveNotes = {}
    mockPlaySound.mockClear()
    mockStopSound.mockClear()
    mockHandlePlayNote.mockClear()
    mockHandleStopNote.mockClear()
    mockPiano.mockClear()
  })

  it('releases the note on touchend even when the key stop callback is missed', () => {
    const { getByTestId } = render(<Keyboard />)

    fireEvent.touchStart(getByTestId('touch-key'))
    expect(mockHandlePlayNote).toHaveBeenCalledWith(60)
    expect(mockPlaySound).toHaveBeenCalledWith(60)

    expect(mockHandleStopNote).not.toHaveBeenCalled()
    expect(mockStopSound).not.toHaveBeenCalled()

    fireEvent.touchEnd(window)

    expect(mockHandleStopNote).toHaveBeenCalledWith(60)
    expect(mockStopSound).toHaveBeenCalledWith(60)
  })

  it('passes both midi and keyboard active notes to Piano', () => {
    mockMidiActiveNotes = { 61: true, 62: false }
    mockKeyboardActiveNotes = { 60: true, 63: false }

    render(<Keyboard />)

    const lastPianoProps =
      mockPiano.mock.calls[mockPiano.mock.calls.length - 1][0]
    expect(lastPianoProps.activeNotes).toEqual(expect.arrayContaining([60, 61]))
    expect(lastPianoProps.activeNotes).not.toEqual(
      expect.arrayContaining([62, 63])
    )
  })

  it('uses a reduced note range on small screens', () => {
    setInnerWidth(390)
    render(<Keyboard />)

    const lastPianoProps =
      mockPiano.mock.calls[mockPiano.mock.calls.length - 1][0]
    expect(lastPianoProps.noteRange).toEqual({ first: 48, last: 72 })
  })

  it('uses full note range on large screens', () => {
    setInnerWidth(1024)
    render(<Keyboard />)

    const lastPianoProps =
      mockPiano.mock.calls[mockPiano.mock.calls.length - 1][0]
    expect(lastPianoProps.noteRange).toEqual({ first: 36, last: 84 })
  })

  it('renders note labels as non-selectable and non-interactive', () => {
    const { getByText } = render(<Keyboard />)
    const label = getByText('c')
    const style = label.getAttribute('style') || ''
    expect(style).toContain('pointer-events: none')
    expect(style).toContain('user-select: none')
  })

  it('prevents context menu behavior on keyboard interaction area', () => {
    const { getByTestId } = render(<Keyboard />)
    const event = createEvent.contextMenu(getByTestId('touch-key'))
    fireEvent(getByTestId('touch-key'), event)
    expect(event.defaultPrevented).toBe(true)
  })
})

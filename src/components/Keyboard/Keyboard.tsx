import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useRef, useState } from 'react'
import { KeyboardShortcuts, MidiNumbers, Piano } from 'react-piano'
import 'react-piano/dist/styles.css'
import { InstrumentName } from 'soundfont-player'
import styled, { css } from 'styled-components'
import { useSettings } from '../../core/contexts/SettingsContext'
import { useTrainer } from '../../core/contexts/TrainerContext'
import { useMidiDevices } from '../../core/hooks/useMidiDevices'
import { usePianoKeyboard } from '../../core/hooks/usePianoKeyboard'
import { normalizeNoteName } from '../../core/services/noteService'
import SoundfontProvider from '../SoundfontProvider'

const KeyboardContainer = styled.div<{ hide: boolean }>`
  height: 25vh;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: none;
  ${(p) =>
    p.hide &&
    css`
      transform: translateY(25vh);
    `}
`

const Keyboard = () => {
  const { t } = useTranslation()
  const { muteSound, showKeyboard, midiDevice, pianoSound } = useSettings()
  const { addToChordStack, removeFromChordStack } = useTrainer()
  const pressedNotesRef = useRef<Set<number>>(new Set())
  const stopSoundRef = useRef<(midiNumber: number) => void>(() => {})
  const [isSmallScreen, setIsSmallScreen] = useState(
    () => window.innerWidth <= 768
  )

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Setup MIDI range for keyboard
  const firstNote = MidiNumbers.fromNote(isSmallScreen ? 'c3' : 'c2')
  const lastNote = MidiNumbers.fromNote(isSmallScreen ? 'c5' : 'c6')

  // Setup keyboard shortcuts
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote,
    lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  })

  // Handle MIDI devices
  const { activeNotes: midiDeviceActiveNotes } = useMidiDevices({
    initialDeviceId: midiDevice?.id,
    onNoteOn: addToChordStack,
    onNoteOff: removeFromChordStack,
  })

  // Keyboard interaction logic
  const {
    activeNotes: keyboardActiveNotes,
    handlePlayNote,
    handleStopNote,
  } = usePianoKeyboard({
    firstNote,
    lastNote,
  })

  const activeNotes = Array.from(
    new Set([
      ...Object.keys(midiDeviceActiveNotes).filter(
        (v: string) => midiDeviceActiveNotes[Number(v)]
      ),
      ...Object.keys(keyboardActiveNotes).filter(
        (v: string) => keyboardActiveNotes[Number(v)]
      ),
    ])
  ).map((s: string) => Number(s))

  const releaseTouchedNotes = useCallback(
    (event: TouchEvent) => {
      if (event.touches.length > 0) return

      const notes = Array.from(pressedNotesRef.current)
      if (notes.length === 0) return

      pressedNotesRef.current.clear()
      notes.forEach((midiNumber) => {
        handleStopNote(midiNumber)
        stopSoundRef.current(midiNumber)
      })
    },
    [handleStopNote]
  )

  useEffect(() => {
    window.addEventListener('touchend', releaseTouchedNotes)

    return () => {
      window.removeEventListener('touchend', releaseTouchedNotes)
    }
  }, [releaseTouchedNotes])

  return (
    <SoundfontProvider
      instrumentName={(pianoSound || 'acoustic_grand_piano') as InstrumentName}
      hostname={'https://d1pzp51pvbm36p.cloudfront.net'}
      format={'mp3'}
      soundfont={'MusyngKite'}
      onLoad={() => {}}
      render={({ playNote, stopNote }) => {
        stopSoundRef.current = stopNote as (midiNumber: number) => void

        return (
          <KeyboardContainer
            hide={!showKeyboard}
            onContextMenu={(event) => event.preventDefault()}
            onTouchStartCapture={(event) => event.preventDefault()}
            onTouchMoveCapture={(event) => event.preventDefault()}
          >
            <Piano
              noteRange={{ first: firstNote, last: lastNote }}
              playNote={(midiNumber: number) => {
                pressedNotesRef.current.add(midiNumber)
                handlePlayNote(midiNumber)
                if (!muteSound) {
                  playNote(midiNumber)
                }
              }}
              stopNote={(midiNumber: number) => {
                pressedNotesRef.current.delete(midiNumber)
                handleStopNote(midiNumber)
                stopNote(midiNumber)
              }}
              keyboardShortcuts={keyboardShortcuts}
              renderNoteLabel={({
                midiNumber,
                isAccidental,
              }: {
                midiNumber: number
                isAccidental: boolean
              }) => (
                <p
                  className='ReactPiano__NoteLabel'
                  style={{
                    color: isAccidental ? 'white' : 'black',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    WebkitTouchCallout: 'none',
                  }}
                >
                  {t(
                    normalizeNoteName(
                      MidiNumbers.getAttributes(midiNumber).note.replace(
                        /[0-9]/,
                        ''
                      )
                    )
                  )}
                </p>
              )}
              activeNotes={activeNotes}
            />
          </KeyboardContainer>
        )
      }}
    />
  )
}

export default Keyboard

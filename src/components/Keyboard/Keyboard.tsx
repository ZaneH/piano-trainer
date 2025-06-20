/**
 * Refactored version of the Keyboard component
 */
import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { KeyboardShortcuts, MidiNumbers, Piano } from 'react-piano'
import 'react-piano/dist/styles.css'
import styled, { css } from 'styled-components'
import { useMidiDevices } from '../../core/hooks/useMidiDevices'
import { usePianoKeyboard } from '../../core/hooks/usePianoKeyboard'
import { normalizeNoteName } from '../../core/services/noteService'
import { useSettings } from '../../core/contexts/SettingsContext'
import { useTrainer } from '../../core/contexts/TrainerContext'
import SoundfontProvider from '../SoundfontProvider'
import { InstrumentName } from 'soundfont-player'

const KeyboardContainer = styled.div<{ hide: boolean }>`
  height: 25vh;
  ${(p) =>
    p.hide &&
    css`
      transform: translateY(25vh);
    `}
`

const Keyboard = () => {
  const { t } = useTranslation()
  const { muteSound, showKeyboard, midiDevice, setMidiDevice, pianoSound } =
    useSettings()
  const { addToChordStack, removeFromChordStack } = useTrainer()

  // Setup MIDI range for keyboard
  const firstNote = MidiNumbers.fromNote('c3')
  const lastNote = MidiNumbers.fromNote('c5')

  // Setup keyboard shortcuts
  const keyboardShortcuts = KeyboardShortcuts.create({
    firstNote,
    lastNote,
    keyboardConfig: KeyboardShortcuts.HOME_ROW,
  })

  // Handle MIDI devices
  const { activeNotes } = useMidiDevices({
    initialDeviceId: midiDevice?.id,
    onNoteOn: addToChordStack,
    onNoteOff: removeFromChordStack,
  })

  // Keyboard interaction logic
  const { handlePlayNote, handleStopNote } = usePianoKeyboard({
    firstNote,
    lastNote,
  })

  return (
    <SoundfontProvider
      instrumentName={(pianoSound || 'acoustic_grand_piano') as InstrumentName}
      hostname={'https://d1pzp51pvbm36p.cloudfront.net'}
      format={'mp3'}
      soundfont={'MusyngKite'}
      onLoad={() => {}}
      render={({ playNote, stopNote }) => {
        return (
          <KeyboardContainer hide={!showKeyboard}>
            <Piano
              noteRange={{ first: firstNote, last: lastNote }}
              playNote={(midiNumber: number) => {
                handlePlayNote(midiNumber)
                !muteSound && playNote(midiNumber)
              }}
              stopNote={(midiNumber: number) => {
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
                  style={{ color: isAccidental ? 'white' : 'black' }}
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
              activeNotes={Object.keys(activeNotes)
                .filter((v: string) => activeNotes[Number(v)])
                .map((s: string) => Number(s))}
            />
          </KeyboardContainer>
        )
      }}
    />
  )
}

export default Keyboard
